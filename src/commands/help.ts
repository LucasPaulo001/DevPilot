import { log } from '@clack/prompts';
import chalk from 'chalk';
import boxen from 'boxen';

export const help = async () => {
  console.clear();

  const title = chalk.bold.white('DevPilot Help 🚀');

  const commands = `
${chalk.cyan('--help')}           Mostrar esta ajuda
${chalk.cyan('--v, --version')}  Mostrar versão do DevPilot-core
${chalk.cyan('--doc')}            Abrir documentação
${chalk.cyan('--publish-npm')}    Publicar CLI no npm
`;

  const features = `
➡ Criar um novo projeto CLI
➡ Criar um novo comando para o seu CLI
➡ Registrar flags ao CLI (Registro de Flags base)
➡ Publicação no npm
`;

  const boxContent = `
${title}

Comandos Disponíveis:
${commands}

Funcionalidades:
${features}
`;

  const box = boxen(boxContent, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'gray',
  });

  console.log(box);
  log.info('Use DevPilot para acelerar sua produtividade!');
};


