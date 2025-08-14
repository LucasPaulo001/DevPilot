import { outro, intro, text } from '@clack/prompts';
import fs from 'node:fs';
import path from 'node:path';

export const createCLI = async () => {
  intro('Criação de CLI:');

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
        return 'Essa pasta já existe!';
      }
    },
  });

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

  outro(
    `CLI criado com sucesso em: "${String(pathName)}"\n
    Execute agora:\n
    cd ${String(pathName)}\n
    npm install`,
  );
};
