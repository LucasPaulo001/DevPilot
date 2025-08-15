import { outro, intro, text, log } from '@clack/prompts';
import chalk from 'chalk';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { registerCLIs } from './registerCLIs.js';

//função para criação da base do diretório CLI
export const createCLI = async () => {
  intro('\nCriação de CLI 📁:');

  const existPath: string[] = fs
    .readdirSync(process.cwd())
    .filter((item) =>
      fs.statSync(path.join(process.cwd(), item)).isDirectory(),
    );

  const pathName = await text({
    message: 'Nomeie uma pasta para armazenar o CLI no DevPilot:',
    placeholder: './meu-cli',
    validate: (value: string) => {
      if (!value || value.trim() === '') {
        return 'A Criação de pasta para o CLI é obrigatória!';
      }

      if (existPath.includes(value.trim())) {
        return chalk.hex('#FFA500')('⚠️ Essa pasta já existe!');
      }
    },
  });

  const pathDestineCLI = path.join(process.cwd(), String(pathName));

  //Armazenando credenciais do CLI no devpilot-cli.json
  await registerCLIs(String(pathName), pathDestineCLI);

  //Comando base para o novo CLI criado
  const data = `#!/usr/bin/env node
import { intro, outro, log, select } from '@clack/prompts';

async function main() {
  intro('🚀 CLI Gerado pelo DevPilot');

  const action = await select({
    message: 'Escolha uma ação:',
    options: [
      { value: 'hello', label: 'Dizer Olá' },
      { value: 'exit', label: 'Sair' }
    ]
  });

  if (action === 'hello') log.info('Olá Mundo!');
  outro('Feito!');
}

main();
`;

  //Criação do arquivo index
  const rootPath = process.cwd();
  const destinePath = path.join(rootPath, String(pathName), 'src', 'cli');

  fs.mkdirSync(destinePath, { recursive: true });

  const index = path.join(destinePath, 'index.ts');
  fs.writeFileSync(index, data, 'utf8');

  //Criação do package.json
  const destinePkg = path.join(rootPath, String(pathName), 'package.json');
  const pkg = {
    name: 'meu-cli',
    version: '1.0.0',
    description: 'CLI gerada pelo DevPilot',
    main: 'dist/cli/index.js',
    bin: {
      'meu-cli': 'dist/cli/index.js',
    },
    type: 'module',
    scripts: {
      dev: 'tsx watch src/cli/index.ts',
      build: 'tsc',
      start: 'node dist/cli/index.js',
    },
    dependencies: {
      '@clack/prompts': '^0.11.0',
    },
    devDependencies: {
      typescript: '^5.9.2',
      tsx: '^4.7.0',
    },
    keywords: ['cli', 'devpilot'],
    author: '',
    license: 'MIT',
  };

  fs.writeFileSync(destinePkg, JSON.stringify(pkg, null, 2), 'utf8');

  //Criação do arquivo yaml
  const destineYaml = path.join(
    rootPath,
    String(pathName),
    'devpilot.config.yaml',
  );
  const yaml = `name: ${String(pathName)}
description: CLI gerada pelo DevPilot
version: 1.0.0
commands:
  - hello
  - ping
  `;

  fs.writeFileSync(destineYaml, yaml, 'utf8');

  //Criação do tsconfig
  const destineTsconfig = path.join(
    rootPath,
    String(pathName),
    'tsconfig.json',
  );
  const tsconfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'Node',
      rootDir: 'src',
      outDir: 'dist',
      strict: true,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      skipLibCheck: true,
    },
    include: ['src/**/*'],
    exclude: ['dist'],
  };

  fs.writeFileSync(destineTsconfig, JSON.stringify(tsconfig, null, 2), 'utf8');

  //Criação do diretório de comandos
  const commandsPath = path.join(rootPath, String(pathName), 'src', 'commands');
  fs.mkdirSync(commandsPath, { recursive: true });

  //Criação de comandos

  //Hello
  fs.writeFileSync(
    path.join(commandsPath, 'hello.ts'),
    `export default async function() { console.log("Olá, mundo!"); }`,
    'utf8',
  );

  //ping
  fs.writeFileSync(
    path.join(commandsPath, 'ping.ts'),
    `export default async function() { console.log("Pong!"); }`,
    'utf8',
  );

  //Encaminhando a pasta do projeto para o build
  const cliPath = path.join(process.cwd(), String(pathName));

  // Geramdo dist do CLI criado
  execSync('npm run build', { cwd: cliPath, stdio: 'inherit' });
  log.info(chalk.green('Gerando build do CLI...'));

  outro(
    chalk.whiteBright(`CLI criado com sucesso em: "${String(pathName)}"\n
    Execute agora:\n
    cd ${String(pathName)}\n
    npm install`),
  );
};
