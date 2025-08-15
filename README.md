# DevPilot 🚀👨🏽‍🚀

<details>
<summary><strong>Documentação - 🇧🇷 Português</strong></summary>

---
<details>
 <summary><strong>Sumário</strong></summary>
  
- [Funcionalidades](#funcionalidades)
- [Uso](#uso)
- [Flags](#flags)
- [Usando a partir do NPM](#npm)
- [Criando CLI](#criando_cli)
  
</details>

---

DevPilot é um **gerador de CLIs** que permite criar, abrir e gerenciar CLIs de forma simples, com suporte a comandos personalizados e plugins.  

<h2 id="funcionalidades">Funcionalidades</h2>

- Criar novos CLIs automaticamente (`createCLI`).  
- Adicionar comandos aos CLIs existentes.  
- Flags globais:
  - `--help` para exibir instruções.
  - `--version` para ver a versão do DevPilot.
  - `--doc` para exibir documentação
- Build automático para cada CLI criado.  

<h2 id="uso">Como usar?</h2>

1. Clone este repositório:  
```bash
git clone https://github.com/LucasPaulo001/DevPilot.git
```
2. Vá para a branch de desenvolvimento
```bash
git checkout feature-devp/configs
```
3. Na raiz do projeto instale as dependências
```bash
npm install
```
4. Gere a dist para melhores testes (O projeto buildado é a melhor opção para testes diretos do terminal)
```bash
npm run build
```
5. Agora é só rodar o index da dist com o comando
```bash
npm start
```
---
<h2 id="flags">Testando as flags (comandos globais)</h2>

1. Rode o projeto direto da dist utilizando o node com as flags
> Para ajuda
```bash
node dist/cli/index.js --help
```
> Para verificar a versão do DevPilot
```bash
node dist/cli/index.js --v
```
ou
```bash
node dist/cli/index.js --version
```
> Para ter acesso à documentação
```bash
node dist/cli/index.js --doc
```

---

<h2 id="npm">Usando o DevPilot a partir do npm</h2>

1. Baixe o DevPilot globalmente
```bash
npm install devpilot-core -g
```
2. Abra seu projeto onde ficará o cli e instale o clack (Lib para funcionamento do questionário)
```bash
npm install @clack/prompts
```
3. Agora inicialize o devpilot e crie o projeto base para o seu CLI
```bash
devpilot
```
---
## As flags globais a partir do npm são:
1. Ajuda
```bash
devpilot --help
```
2. Documentação
```bash
devpilot --doc
```
3. Versão
```bash
devpilot --version
```
---

<h2 id="criando_cli">Criando Meu CLI</h2>

Ao gerar um CLI teremos vários arquivos:

meu-cli

- ├── src/
- | ├── dist/
- │ ├── cli/
- │ │ └── index.ts
- │ ├── commands/
- │ │ ├── hello.ts
- │ │ ├── ping.ts
- | └── devpilot.config.yaml
- ├── package.json
- └── tsconfig.json


> **index.ts** é o ponto de partida para a criação da interface de comandos do CLI.  
> É nele que vamos criar o questionário principal para os comandos.  
>  
> A pasta **commands** é onde ficarão nossos comandos, ou seja, onde fica a automação que vamos construir para o CLI.

</details>

---
<details>
  <summary><strong>Documentation - 🇺🇸 English</strong></summary>

---
  <details>
  <summary><strong>Table of Contents</strong></summary>
  
- [Features](#features)
- [Usage](#usage)
- [Flags](#flags)
- [Using via NPM](#npm)
- [Creating CLI](#creating_cli)
  
</details>

---

DevPilot is a **CLI generator** that allows you to create, open, and manage CLIs easily, with support for custom commands and plugins.  

<h2 id="features">Features</h2>

- Automatically create new CLIs (`createCLI`).  
- Add commands to existing CLIs.  
- Global flags:
  - `--help` to display instructions.
  - `--version` to check the DevPilot version.
  - `--doc` to display documentation.
- Automatic build for each created CLI.  

<h2 id="usage">Usage</h2>

1. Clone this repository:  
```bash
git clone https://github.com/LucasPaulo001/DevPilot.git
```
2. Switch to the development branch
```bash
git checkout feature-devp/configs
```
3. In the project root, install dependencies
```bash
npm install
```
4. Build the project for better testing (built version is the best option for direct terminal tests)
```bash
npm run build
```
5. Now just run the index in the dist folder with:
```bash
npm start
```

<h2 id="flags">Testing flags (global commands)</h2>

1. Run the project directly from dist using Node with the flags:

> For help
```bash
node dist/cli/index.js --help
```
> To check DevPilot version
```bash
node dist/cli/index.js --v
```
or
```bash
node dist/cli/index.js --version
```
> To access documentation
```bash
node dist/cli/index.js --doc
```

<h2 id="npm">Using DevPilot via NPM</h2>

1. Install DevPilot globally
```bash
npm install devpilot-core -g
```
2. Open your project where the CLI will reside and install Clack (library for questionnaire functionality)
```bash
npm install @clack/prompts
```
3. Initialize DevPilot and create the base project for your CLI
```bash
devpilot
```

## Global flags via npm:

1. Help
```bash
devpilot --help
```
2. Documentation
```bash
devpilot --doc
```
3. Version
```bash
devpilot --version
```

<h2 id="creating_cli">Creating My CLI</h2>

When generating a CLI, the following files will be created:

my-cli

- ├── src/
- | ├── dist/
- │ ├── cli/
- │ │ └── index.ts
- │ ├── commands/
- │ │ ├── hello.ts
- │ │ ├── ping.ts
- | └── devpilot.config.yaml
- ├── package.json
- └── tsconfig.json

> **index.ts** is the entry point for creating the CLI command interface.
> This is where we will build the main questionnaire for commands.
> 
> The **commands** folder is where our commands will reside, meaning the automation we will build for the CLI.

</details>

