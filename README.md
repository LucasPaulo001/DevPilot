# DevPilot 🚀👨🏽‍🚀

DevPilot é um **gerador de CLIs** que permite criar, abrir e gerenciar CLIs de forma simples, com suporte a comandos personalizados e plugins.  

## Funcionalidades atuais

- Criar novos CLIs automaticamente (`createCLI`).  
- Adicionar comandos aos CLIs existentes.  
- Flags globais:
  - `--help` para exibir instruções.
  - `--version` para ver a versão do DevPilot.
  - `--doc` para exibir documentação
- Build automático para cada CLI criado.  

## Como usar

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
### Testando as flags (comandos globais)
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

---

## Usando o DevPilot a partir do npm
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
