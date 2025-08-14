import { log } from '@clack/prompts';
import chalk from 'chalk';

export const help = async () => {
  log.info(chalk.blueBright('🚀 DevPilot help\n'));

  console.log(chalk.magenta('Comandos Disponíveis:'));
  console.log('--help     -       Mostrar essa ajuda');
  console.log('--v        -       Mostrar essa ajuda');
  console.log(chalk.magenta('\nFuncionalidades atuais do DevPilot:'));
  console.log('Criar um novo projeto CLI');
  console.log('Criar um novo comando para o seu CLI');
};

