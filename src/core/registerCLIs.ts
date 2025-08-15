import path from 'path';
import fs from 'fs';

interface ICliItem {
  name: string;
  path: string;
  createdAt: string;
}

interface ICli {
  clis: ICliItem[];
}

export const registerCLIs = async (pathName: string, pathDestine: string) => {
  try {
    //Arquivo de gerenciamento de CLIs
    const registerPath = path.join(process.cwd(), 'devpilot-cli.json');

    //Lendo registro de CLIs, caso não tenha ele cria outro
    let register: ICli = { clis: [] };
    if (fs.existsSync(registerPath)) {
      register = JSON.parse(fs.readFileSync(registerPath, 'utf-8'));
    }

    const relativePath = path.relative(process.cwd(), pathDestine);
    // adiciona o CLI recém-criado
    register.clis.push({
      name: `${String(pathName)}`,
      path: `${relativePath}`,
      createdAt: new Date().toISOString(),
    });

    //Inserindo informações no json
    fs.writeFileSync(registerPath, JSON.stringify(register, null, 2), 'utf-8');
  } catch (err: any) {
    console.log(err);
  }
};
