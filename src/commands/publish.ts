import { confirm, log, select, text } from '@clack/prompts';
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
    if (publishType === 'restricted') {
      const name = await getNameCLI(cliPath);
      await editName(name, cliPath);
    }
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
    try{
      log.info("Redirecionando para o login...");
      execSync(`npm login`, { stdio: 'inherit' });
      execSync(`npm whoami`, { stdio: "inherit" });
      log.success('✅ Login realizado com sucesso!');
    }
    catch{
      log.error('❌ Não foi possível realizar login no npm.');
      process.exit(1);
    }
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

    //Modificar name do package.json caso já exista
    const modifyName = await confirm({
      message: 'Deseja fazer a modificação?',
    });

    if (modifyName) {
      await modifyNameProject(cliPath);
    }

    process.exit(1);
  } catch {
    log.success(`✅ Nome "${nameProject}" disponível para uso no npm!`);
  }
};

//Função que atualiza o name do package.json
const setPackageName = async (pkgPath: string, newName: string) => {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkg.name = newName;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  log.success(`Nome atualizado para "${newName}" no package.json!`);

  const continuePublish = await confirm({
    message: "Deseja publicar no npm agora?"
  });

  if(continuePublish){
    await publishInNPM();
  }
};

//Função para editar name no package json (importante para publicações restricted)
const editName = async (name: string, pathPkg: string) => {
  try {
    if (name.startsWith('@')) return;

    const userNpmName = execSync(`npm whoami`).toString().trim();

    const scope = await text({
      message: `Digite o escopo desejado (ex: ${userNpmName}):`,
      placeholder: '@meu-usuario',
      validate: (value: string) => {
        return value.startsWith('@')
          ? undefined
          : "O escopo tem que começar com '@'";
      },
    });

    //Atualizando nome
    const newName = `${String(scope)}/${name}`;
    log.success('Atualizando escopo...');

    //Inserindo novo nome no package.json
    setPackageName(pathPkg, newName);

    log.success('Escopo atualizado com sucesso!');
  } catch (err: any) {
    log.error(
      chalk.red(`Erro ao editar nome do arquivo 'package.json': ${err}`),
    );
  }
};

//Função para modificar o nome do projeto caso ele já esteja em uso no npm
const modifyNameProject = async (cliPath: string) => {
  const pkgPath = path.join(cliPath, 'package.json');

  while (true) {
    const newName = await text({
      message: 'Informe um novo nome:',
    });

    try {
      execSync(`npm view ${String(newName)}`, { stdio: 'ignore' });
      log.error(`❌ Nome "${String(newName)}" já está em uso! Tente outro.`);
    } catch {
      setPackageName(pkgPath, String(newName));
      break;
    }
  }
};
