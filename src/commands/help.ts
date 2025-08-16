import { log } from '@clack/prompts';
import chalk from 'chalk';

export const help = async () => {
  log.info(chalk.blueBright('🚀 DevPilot help\n'));

  console.log(chalk.magenta('Comandos Disponíveis:'));
  console.log('--help     =>       Mostrar essa ajuda');
  console.log('--v ou --version   =>       Mostrar versão do DevPilot-core');
  console.log('--doc        =>       Ter acesso à documentação');
  console.log(chalk.magenta('\nFuncionalidades atuais do DevPilot:'));
  console.log('Criar um novo projeto CLI');
  console.log('Criar um novo comando para o seu CLI');
};

