#!/usr/bin/env node

import { intro, log, outro, select } from '@clack/prompts';
import { createCLI } from '../core/createCLI.js';
import yaml from 'js-yaml';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { createNewCommand } from '../core/createCommands.js';
import { processArgs } from '../core/detailsDevPilot.js';
import { processArgsAction } from '../core/actionsCLI.js';
import { addFlag } from '../core/registerFlagsCLI.js';
import { testImplement } from '../core/testImplement.js';

// Carrega o YAML
const configPath = path.resolve(process.cwd(), 'devpilot.config.yaml');
let config: any = {};

if (fs.existsSync(configPath)) {
  const fileContents = fs.readFileSync(configPath, 'utf-8');
  config = yaml.load(fileContents);
} else {
  console.log(
    '⚠️  Arquivo devpilot.config.yaml não encontrado. Usando configurações padrão.',
  );
  config = {
    cliName: 'default-cli',
    author: 'desconhecido',
  };
}

const main = async () => {
  const handled = await processArgs(process.argv);
  if (handled) return;

  const handledCLI = await processArgsAction(process.argv);
  if (handledCLI) return;

  intro(chalk.bgHex('#0B0F2D').white(`🚀 Bem vindo(a) ao Devpilot 🌌`));

  let runnig = true;

  while (runnig) {
    const actions = await select({
      message: 'O que você deseja fazer?',
      options: [
        { value: 'criar', label: '🆕 Criar novo CLI' },
        { value: 'abrir', label: '📂 Abrir CLI existente' },
        { value: 'plugins', label: '🧩 Gerenciar plugins' },
        { value: 'sair', label: '❌ Sair' },
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

        if (dirs.length === 0) {
          log.error('Não tem nenhum CLI por aqui ainda...');
          break;
        }

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
    { value: '__flag__', label: '⚑ Adicionar flags' },
    { value: '__tests__', label: '🧪 Implementar testes' },
    ...commandFiles.map((file) => ({
      value: file.replace(/\.(ts|js)$/, ''),
      label: `📜 ${file.replace(/\.(ts|js)$/, '')}`,
    })),
    { value: '__voltar__', label: '< Voltar' },
  ];

  //Escolher os comandos do CLI selecionado
  let running = true;
  while (running) {
    const commandName = await select({
      message: `CLI: ${cliConfig.name} - Escolha um comando`,
      options: commandOptions,
    });

    //Caso de criação de comando em CLI
    if (commandName === '__create__') {
      await createNewCommand(cliPath);
      continue;
    }

    //Criação de flags
    if (commandName === '__flag__') {
      await addFlag(cliPath);
      continue;
    }

    //Implementação de testes ao CLI
    if (commandName === '__tests__') {
      await testImplement(cliPath);
      continue;
    }

    //Voltar
    if (commandName === '__voltar__') {
      running = false;
      continue;
    }

    //Caminho para os comandos
    const commadsDir = path.join(cliPath, 'dist', 'commands');
    let commandPath = path.join(commadsDir, `${String(commandName)}.js`);

    const commandModule = await import(commandPath);
    const fnName = path.basename(commandPath, path.extname(commandPath)); 
    await commandModule[fnName]();

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
