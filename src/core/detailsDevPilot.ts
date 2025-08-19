import path from 'path';
import { help } from '../commands/help.js';
import fs from "fs"
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { log } from '@clack/prompts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(__filename);

export const processArgs = async (argv: string[]): Promise<boolean> => {
    const args = argv.slice(2);

    //Flag para ajuda
    if (args.includes('--help')) {
        await help();
        return true;
    }

    //Flag para ver a versão do DevPilot
    if(args.includes("--v") || args.includes("--version")){
        const pathPkg = path.resolve(__dirname, "../../../package.json");
        const pkg = JSON.parse(fs.readFileSync(pathPkg, 'utf-8'));
        console.log(`Versão do DevPilot: ${pkg.version}`);
        return true;
    }

    //Flag para a documentação da aplicação
    if(args.includes("--doc")){
        console.log("📖 Documentação DevPilot-core:")
        console.log(chalk.magenta("https://github.com/LucasPaulo001/DevPilot/tree/feature-devp/configs"));
        return true;
    }

    //Flag para atualizar o devpilot
    if(args.includes("--update")){
        log.info("Atualizando o Devpilot...");
        execSync(`npm install devpilot-core -g`, { stdio: "ignore" });
        log.success(chalk.green.bold("Devpilot atualizado com sucesso! 🚀"));
        return true;
    }
    

    return false;
}
