import { log, select } from '@clack/prompts';
import chalk from 'chalk';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

export const publishInNPM = async () => {
  //Verificando se o usuário está logado no npm
  await checkNpmLogin();

  //Verificação do nome do projeto
  const cliPath = process.cwd();
  await verifyNameProject(cliPath);

  //Tipo de publicação
  const publishType = await select({
    message: 'Deseja publicar o CLI como public ou private?',
    options: [
      { value: 'public', label: 'Public (qualquer um pode instalar)' },
      { value: 'restricted', label: 'Private (apenas você/organização)' },
    ],
  });

  //Verificando versão do CLI
  execSync('npm version patch', { stdio: 'inherit', cwd: cliPath });

  //Publicando CLI no npm
  try {
    execSync(`npm publish --access ${String(publishType)}`, {
      stdio: 'inherit',
      cwd: cliPath,
    });
    log.success('✅ CLI publicado no npm com sucesso!');
  } catch (err: any) {
    log.error(`❌ Falha ao publicar o CLI: ${err}`);
  }
};

//Função que verifica se o usuário está logado no npm
const checkNpmLogin = async () => {
  try {
    execSync(`npm whoami`, { stdio: 'inherit' });
    log.success('✅ Você está logado no npm');
  } catch (err) {
    log.error(chalk.red('⚠️ Você não está logado no npm!'));
    execSync(`npm login`, { stdio: 'inherit' });
  }
};

//Função para pegar o nome do projeto
const getNameCLI = async (cliPath: string) => {
  const pkgPath = path.join(cliPath, 'package.json');

  if (!fs.existsSync(pkgPath)) {
    log.error('❌ package.json não encontrado no CLI.');
    process.exit(1);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

  if (!pkg.name) {
    log.error('❌ O package.json não possui o campo "name".');
    process.exit(1);
  }

  return pkg.name;
};

//Função para verificar originalidade do nome no npm
const verifyNameProject = async (cliPath: string) => {
  const nameProject = await getNameCLI(cliPath);
  try {
    execSync(`npm view ${nameProject}`, { stdio: 'ignore' });
    log.error(`❌ Nome "${nameProject}" já está em uso!`);

    process.exit(1);
  } catch {
    log.success(`✅ Nome "${nameProject}" disponível para uso no npm!`);
  }
};
