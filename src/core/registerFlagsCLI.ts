import { log, select } from '@clack/prompts';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

export const addFlag = async (cliPath: string) => {
  const flagsPath = path.join(cliPath, 'src', 'flags');

  if (!fs.existsSync(flagsPath)) fs.mkdirSync(flagsPath, { recursive: true });

  //Adicionar flags já estruturadas
  const flags = await select({
    message: 'Qual flag quer adicionar?',
    options: [
      {
        value: '--help',
        label: '--help (Mostra ajuda sobre como usar seu CLI.)',
      },
      { 
        value: '--version', 
        label: '--version (Mostrar a versão do seu CLI.)' 
      },
      {
        value: '--update',
        label: '--update (Atualizar o CLI, caso postado no npm.)'
      }
    ],
  });

  if (flags) await registerFlag(String(flags), flagsPath, cliPath);
};

//Registro de flag estruturada
const registerFlag = async (
  flagName: string,
  flagsPath: string,
  cliPath: string,
) => {

  //Tratando o nome da flag
  const flagFileName = flagName.replace('--', '');
  const functionName = `${flagFileName}Flag`;
  const flagArchive = path.join(flagsPath, `${flagFileName}.ts`);

  //Conteúdo base do arquivo da flag
  const flagData = `
export const ${functionName} = () => {
  console.log("Executando ${flagName}");
};`;
  try {
    fs.writeFileSync(flagArchive, flagData, 'utf8');

    //Buscando o content e extraindo os dados, para receber a nova flag
    const actionsPath = path.join(cliPath, 'src', 'flags', 'actions.ts');
    let actionsContent = fs.readFileSync(actionsPath, 'utf8');

    const importLine = `import { ${functionName} } from "./${flagFileName}.js";`;
    if (!actionsContent.includes(importLine)) {
      actionsContent = importLine + '\n' + actionsContent;
    }

    const flagIf = `
    if (args.includes("${flagName}")) {
      ${flagFileName}Flag();
      return true;
    }`;

    if (!actionsContent.includes(`${flagFileName}Flag()`)) {
      actionsContent = actionsContent.replace(
        /return false;/,
        `${flagIf}\n    return false;`
      );
    }

    fs.writeFileSync(actionsPath, actionsContent, "utf8");

    log.success(chalk.green(`Flag ${flagName} registrada com sucesso!`));

  } catch (err) {
    log.error(chalk.red(`Erro ao registrar flag: ${flagName}\n${err}`));
  }
};
