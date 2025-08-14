#!/usr/bin/env node

import { intro, log, outro, select } from '@clack/prompts';
import { createCLI } from '../core/createCLI.js';
import yaml from 'js-yaml';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { createNewCommand } from '../core/cretaeCommands.js';

// Carrega o YAML
const configPath = path.resolve(process.cwd(), 'devpilot.config.yaml');
const config = yaml.load(fs.readFileSync(configPath, 'utf8')) as any;

const main = async () => {
  intro(chalk.bgHex('#0B0F2D').white(`🚀 Bem vindo(a) ao ${config.name} 🌌`));

  let runnig = true;

  while (runnig) {
    const actions = await select({
      message: 'O que você deseja fazer?',
      options: [
        { value: 'criar', label: 'Criar novo CLI' },
        { value: 'abrir', label: 'Abrir CLI existente' },
        { value: 'plugins', label: 'Gerenciar plugins' },
        { value: 'sair', label: 'Sair' },
      ],
    });

    switch (actions) {
      case 'criar':
        await createCLI();
        break;

      case 'abrir':
        const dirs = fs.readdirSync(process.cwd()).filter((f) => {
          const fullPath = path.join(process.cwd(), f);
          const isDir = fs.statSync(fullPath).isDirectory();
          const isHidden = f.startsWith('.');
          const ignored = ['node_modules', 'src', 'dist'];
          return isDir && !isHidden && !ignored.includes(f);
        });

        const cliToOpen = await select({
          message: 'Escolha um CLI para abrir:',
          options: dirs.map((d) => ({ value: d, label: d })),
        });

        await openCLI(String(cliToOpen));
        break;

      case 'plugins':
        console.log('\nPlugins em desenvolvimento!');
        break;

      case 'sair':
        runnig = false;
        break;
    }
  }

  outro('Feito!');
};

//Função para abrir CLI existente
const openCLI = async (cliName: string) => {
  const cliPath = path.join(process.cwd(), cliName);

  const yamlPath = path.join(cliPath, 'devpilot.config.yaml');
  if (!fs.existsSync(yamlPath)) {
    log.error(chalk.red('Esse CLI não possui devpilot.config.yaml!'));

    return;
  }

  const cliConfig = yaml.load(fs.readFileSync(yamlPath, 'utf8')) as any;
  const commadsDir = path.join(cliPath, 'src', 'commands');

  if (!fs.existsSync(commadsDir)) {
    log.error(chalk.red('Esse CLI não possui pasta src/commands!'));

    return;
  }

  const commandFiles = fs
    .readdirSync(commadsDir)
    .filter((f) => f.endsWith('.ts') || f.endsWith('.js'));

  if (commandFiles.length === 0) {
    log.info('Nenhum comando encontrado.');
    return;
  }

  // Opções de comandos
  const commandOptions = [
    { value: '__create__', label: '➕ Criar novo comando' },
    ...commandFiles.map((file) => ({
      value: file.replace(/\.(ts|js)$/, ''),
      label: file.replace(/\.(ts|js)$/, ''),
    })),
    { value: "__voltar__", label: "Voltar" }
  ];

  //Escolher os comandos do CLI selecionado
  let running = true;
  while (running) {
    const commandName = await select({
      message: `CLI: ${cliConfig.name} - Escolha um comando`,
      options: commandOptions,
    });
  
    //Caso de criação de comando em CLI
    if(commandName === "__create__"){
      await createNewCommand(cliPath);
      continue;
    }

    if(commandName === '__voltar__'){
      running = false;
      continue;
    }


    //Caminho para os comandos
    const commadsDir = path.join(cliPath, 'dist', 'commands');
    let commandPath = path.join(commadsDir, `${String(commandName)}.js`);
    console.log(commandPath);

    const commandModule = await import(commandPath);
    await commandModule.default();

    const again = await select({
      message: 'Deseja executar outro comando?',
      options: [
        { value: 'sim', label: 'Sim' },
        { value: 'nao', label: 'Não' },
      ],
    });
    if (again === 'nao') running = false;
  }
};

main();
