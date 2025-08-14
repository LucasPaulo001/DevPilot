import path from 'path';
import fs from "fs";
import { log } from '@clack/prompts';
import chalk from 'chalk';
import { execSync } from 'child_process';
import crypto from "crypto";

export const createNewCommand = async (pathCli: string) => {
  const commandPath = path.join(pathCli, 'src', 'commands');

  //Gerando identificador único para os comandos (nome de arquivos .ts)
  const id = crypto.randomUUID().split("-")[0];

  //Gerando arquivo para a estruturação do comando
  const newArchiveCommand = path.join(commandPath, `newCommand_${id}.ts`);
  const baseCommand = `import { confirm, intro, log } from '@clack/prompts';
import chalk from 'chalk';

export default async function newCommand_3684a639() {
  intro(
    chalk.magenta(
      'Esse é o ponto de partida para a criação de novos comandos para o seu CLI!',
    ),
  );

  log.info(
    'Por o arquivo newCommand_3684a639 você configurará os seus comandos! :)',
  );
}`
;

  fs.writeFileSync(newArchiveCommand, baseCommand, "utf8");


  // Geramdo dist do CLI criado
  execSync('npm run build', { cwd: pathCli, stdio: 'inherit' });
  log.info(chalk.green('Gerando build do CLI...'));

  log.success(chalk.green(`Arquivo de comando gerado em ${commandPath}!`));
};
