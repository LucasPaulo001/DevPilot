## DevPilot-core
> Guia de Funcionamento

<details>
 <summary>Tópicos</summary>

- [Funcionalidades](#funcionalidades)
- [Executando o projeto](#executando)
- [Testes](#testes)
- [Usando a partir do NPM](#npm)

</details>

---
### Sobre o projeto

O DevPilot CLI é uma ferramenta que auxilia na criação de CLIs automatizados com ``Node.js`` e ``TypeScript``. Ele gera toda a estrutura de diretórios, arquivos de comandos, configuração de testes e build do projeto.

O objetivo deste projeto é facilitar o desenvolvimento de CLIs, ou seja toda a automatização inicial é totalmente customizável.

---

### Estrutura do projeto

- meu-cli/
- ├─ src/
- │  ├─ cli/
- │  │  └─ index.ts =====>        `` Arquivo principal do CLI``
- │  ├─ commands/ =====>        ``Diretório onde ficarão os Comandos``
- │  │  ├─ hello.ts 
- │  │  └─ ping.ts
- │  └─ core/ =====>        ``Diretório onde fica toda a lógica de execução do projeto``
- │     └─ actions.ts =====> ``Arquivo de configuração que centraliza as flags``
- ├─ _ tests _/ =====> ``Diretório contendo os testes (unitários, integração, sistema)``
- │  ├─ unit/              
- │  ├─ integration/        
- │  └─ e2e/               
- ├─ package.json
- ├─ tsconfig.json
- └─ devpilot.config.yaml

---

<h3 id="funcionalidades">Funcionalidades</h3>
> Tudo que o Devpilot gera ao criar um CLI

- Criação automática de CLI e comandos.

- Geração de arquivos de configuração padrão (package.json, .gitignore, README.md etc.).

- Estrutura de testes unitários.

- Build automático do CLI.

---

<h3 id="executando">Executando o CLI</h3>

1. Clone o projeto e instale dependências:

```bash
    git clone https://github.com/LucasPaulo001/DevPilot.git
    cd DevPilot
    npm install
```

2. Rode o CLI:

```bash
    npm start
```

3. Escolha uma ação no menu do CLI.

- Criar novo CLI
- Abrir CLI existente = **Use essa opção para executar ações dentro de um CLI gerado**
- Gerar plugins = **Opção em desenvolvimento...**
- Sair = **Fecha o Devpilot**

---

<h3 id="testes">Estrutura de testes da aplicação</h3>

|1. Testes Unitários:|
|--------------------|

> Na raíz do projeto rode o comando:
```bash
    npm run test:unit
```

- Quais funcionalidades são testadas?

Os testes unitário testam o processo de criação de arquivos ``generateArchive.spec.ts`` e o funcionamento das flags ``processArgs.spec.ts``

---
|2. Testes de integração:|
|------------------------|

> Na raíz do projeto rode o comando:

```bash
    npm run test:integration
```

- Quais funcionalidades são testadas?

Os testes de integração confirma que, ao executar createCLI, a estrutura mínima de arquivos e diretórios do CLI é corretamente criada. Ele não testa a execução real do CLI nem se os comandos funcionam, apenas a criação da estrutura inicial.

---
|3. Testes de sistema (e2e)|
|--------------------------|
> Na raíz do projeto rode o comando:

```bash
    npm run test:system
```

- Quais funcionalidades são testadas?

O teste confirma que a função createCLI consegue criar e buildar o CLI completo, incluindo os arquivos principais, simulando o fluxo real de execução (E2E), mas sem executar comandos interativos reais.
