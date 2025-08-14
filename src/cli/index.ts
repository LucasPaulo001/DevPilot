#!/usr/bin/env node

import { intro, log, outro, select } from "@clack/prompts";
import { createCLI } from "../core/createCLI.js";
import yaml from "js-yaml";
import path from "path";
import fs from "fs";

// Carrega o YAML
const configPath = path.resolve(process.cwd(), "devpilot.config.yaml");
const config = yaml.load(fs.readFileSync(configPath, "utf8")) as any;

const main = async () => {
    intro(`🚀 ${config.name}`);

    let runnig = true;

    while(runnig){
        const actions = await select({
            message: "O que você deseja fazer?",
            options: [
                { value: "criar", label: "Criar novo CLI" },
                { value: "plugins", label: "Gerenciar plugins" },
                { value: "sair", label: "Sair" }
            ]
        });

        switch(actions){
            case "criar":
                await createCLI();
                break;
            
            case "plugins":
                console.log("\nPlugins em desenvolvimento!");
                break;

            case "sair":
                runnig = false;
        }
    }

    outro("Feito!")
}

main();

