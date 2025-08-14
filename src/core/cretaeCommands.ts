import path from 'path';
import fs from "fs";
import { log } from '@clack/prompts';
import chalk from 'chalk';
import { execSync } from 'child_process';

export const createNewCommand = async (pathCli: string) => {
  const commandPath = path.join(pathCli, 'src', 'commands');

  const newArchiveCommand = path.join(commandPath, 'newCommand.ts');
  const baseCommand = `
export default function newCommand(){ console.log("Aqui está seu novo arquivo, para um novo comando!") }
    `;

  fs.writeFileSync(newArchiveCommand, baseCommand, "utf8");


  // Geramdo dist do CLI criado
  execSync('npm run build', { cwd: pathCli, stdio: 'inherit' });
  log.info(chalk.green('Gerando build do CLI...'));

  log.success(chalk.green(`Arquivo de comando gerado em ${commandPath}!`));
};
