import { outro, intro, text, log, select, multiselect } from '@clack/prompts';
import chalk from 'chalk';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

//função para criação da base do diretório CLI
export const createCLI = async () => {
  intro('\nCriação de CLI 📁:');

  //Verificando se já não existe um CLI com o mesmo nome no projeto
  const existPath: string[] = fs
    .readdirSync(process.cwd())
    .filter((item) =>
      fs.statSync(path.join(process.cwd(), item)).isDirectory(),
    );

  // Nome da pasta onde será armazenado o CLI
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

  //Comando base para o novo CLI criado
  const data = `#!/usr/bin/env node
import { intro, outro, log, select } from '@clack/prompts';
import { processArgs } from "../flags/actions.js";

/*
Aqui é onde a estrutura principal do seu CLI é gerado
Para uma melhor experiência é muito recomendável que dê uma olhada
na documentação das seguintes libs

=> Clack: https://github.com/bombshell-dev/clack
=> Chalk: https://github.com/chalk/chalk

*/

const main = async () => {

  const handled = await processArgs(process.argv);
  if (handled) return;

  intro('🚀 CLI Gerado pelo DevPilot');

  //Aqui você estrutura o questionário do seu CLI

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
    name: `${String(pathName)}`,
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
      'test:unit': 'vitest run tests/unit',
      'test:integration': 'vitest run tests/integration',
      'test:system': 'vitest run tests/system',
    },
    dependencies: {
      '@clack/prompts': '^0.11.0',
      chalk: '^5.5.0',
      express: '^5.1.0',
    },
    devDependencies: {
      typescript: '^5.9.2',
      tsx: '^4.7.0',
      '@types/express': '^5.0.3',
      '@types/chalk': '^0.4.31',
      '@types/node': '^24.2.1',
      vitest: '^3.2.4',
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
    include: ['src/cli/**/*', 'src/flags/**/*', 'src/commands/**/*'],
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
    `export const hello = async () => { console.log("Olá, mundo!"); }`,
    'utf8',
  );

  //ping
  fs.writeFileSync(
    path.join(commandsPath, 'ping.ts'),
    `export const ping = async () => { console.log("Pong!"); }`,
    'utf8',
  );

  //Criação de pasta de lógica de flags
  const flagsPath = path.join(rootPath, String(pathName), 'src', 'flags');
  fs.mkdirSync(flagsPath, { recursive: true });

  //Criando arquivo de flags para exemplo
  fs.writeFileSync(
    path.join(flagsPath, 'actions.ts'),
    `export const processArgs = async (argv: string[]): Promise<boolean> => { 
  try {
      const args = argv.slice(2);
  
      return false;
    } catch (err: any) {
      console.error(err);
    }
   
    return false;
}`,
  );

  //Encaminhando a pasta do projeto para o build
  const cliPath = path.join(process.cwd(), String(pathName));

  //Instalando dependências do CLI
  execSync('npm install', { cwd: cliPath, stdio: 'ignore' });
  log.success(chalk.green.bold("Dependências instaladas com sucesso!"));

  //Arquivos adicionais
  const defaultAchives = await multiselect({
    message: `Deseja adicionar os seguintes arquivos ao projeto? ${chalk.magenta.italic('Utilize o space para selecionar')}`,
    options: [
      { value: 'gitignore', label: '.gitignore (padrão node)' },
      { value: 'readme', label: 'README.md' },
      { value: 'contributing', label: 'CONTRIBUTING.md' },
    ],
  });

  //Redirecionando para a criação dos arquivos escolhidos
  if (Array.isArray(defaultAchives)) {
    log.info('Adicionando arquivo(s)');
    if (defaultAchives.includes('gitignore')) {
      await generateArchive('gitignore', String(pathName));
    }

    if (defaultAchives.includes('readme')) {
      await generateArchive('readme', String(pathName));
    }

    if(defaultAchives.includes('contributing')){
      await generateArchive('contributing', String(pathName));
    }
  }

  // Gerando dist do CLI criado
  execSync('npm run build', { cwd: cliPath, stdio: 'inherit' });
  log.info(chalk.green('Gerando build do CLI...'));

  outro(
    chalk.whiteBright(`CLI criado com sucesso em: "${String(pathName)}"\n`),
  );
};

//Gerando arquivos padrão
const generateArchive = async (archive: string, pathName: string) => {
  const rootPath = path.join(process.cwd());
  if (archive === 'gitignore') {
    //Criação do gitignore
    const destineGitIgnore = path.join(
      rootPath,
      String(pathName),
      '.gitignore',
    );

    const gitignore = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Snowpack dependency directory (https://snowpack.dev/)
web_modules/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variable files
.env
.env.*
!.env.example

  
  `;

    //Escrevendo o conteúdo no arquivo
    fs.writeFileSync(destineGitIgnore, gitignore, 'utf8');
  }

  //Gerando o readme
  if(archive === "readme"){
    const destineReadme = path.join(rootPath, pathName, 'README.md');
    const readme = `
## ${pathName} **Gerado pelo Devpilot-core 👨🏽‍🚀**

Fale sobre o seu projeto!

---

## Instalação

Clone o repositório:

- git clone https://github.com/SEU_USUARIO/${pathName}.git
- cd ${pathName}
- npm install
    `
  
  fs.writeFileSync(destineReadme, readme, 'utf-8');
  }

  if(archive === "contributing"){
    const destineContributing = path.join(rootPath, pathName, 'CONTRIBUTING.md');
    const contributing = `
# Contribuindo com ${pathName} 🚀

> Esse arquivo é apenas um exemplo, edite à vontade

Obrigado por se interessar em contribuir com o **${pathName}**!  
Queremos que este projeto seja útil para todos e acessível para iniciantes. 💻

---

## Como começar

1. Faça um fork do repositório.
2. Clone seu fork localmente:

- git clone https://github.com/SEU_USUARIO/${pathName}.git
- cd ${pathName}

3. Instale as dependências:

- npm install

4. Rode o projeto localmente:

- npm start

    `

  fs.writeFileSync(destineContributing, contributing, 'utf-8');
  }

};
