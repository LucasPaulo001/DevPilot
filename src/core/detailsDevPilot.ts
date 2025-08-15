import path from 'path';
import { help } from '../commands/help.js';
import fs from "fs"
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(__filename);

export const processArgs = async (argv: string[]): Promise<boolean> => {
    const args = argv.slice(2);

    //Flag para ajuda
    if (args.includes('--help')) {
        await help();
        process.exit(0);
    }

    //Flag para ver a versão do DevPilot
    if(args.includes("--v") || args.includes("--version")){
        const pathPkg = path.resolve(__dirname, "../../../package.json");
        const pkg = JSON.parse(fs.readFileSync(pathPkg, 'utf-8'));
        console.log(`Versão do DevPilot: ${pkg.version}`);
        process.exit(0);
    }

    //Flag para a documentação da aplicação
    if(args.includes("--doc")){
        console.log("📖 Documentação DevPilot-core:")
        console.log(chalk.magenta("https://github.com/LucasPaulo001/DevPilot/tree/feature-devp/configs"));
        process.exit(0);
    }
    

    return false;
}
