import { log, multiselect, select } from '@clack/prompts';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

//Estruturando testes no CLI
export const testImplement = async (cliPath: string) => {
  try {
    const selectTests = await multiselect({
      message: 'Quais testes deseja implementar?',
      options: [
        { value: 'unitary', label: 'Teste unitário (Vitest)' },
        { value: 'integration', label: 'Teste de integração (Vitest)' },
        { value: 'system', label: 'Teste de sistema (execa)' },
      ],
    });

    //Criando pasta de testes
    const testsPath = path.join(cliPath, 'src', 'tests');
    fs.mkdirSync(testsPath, { recursive: true });

    if (Array.isArray(selectTests)) {
      if (selectTests.includes('unitary')) {
        await unitaryTest(testsPath);
      }

      if (selectTests.includes('integration')) {
        await integrationTest(testsPath);
      }

      if (selectTests.includes('system')) {
        await systemTest(testsPath);
      }

      log.success(chalk.green.bold("🧪 Testes base estruturados..."));
      log.info(`Verifique os scripts em ${chalk.magenta.bold('package.json')} para rodar o(s) teste(s)!`);
    }
  } catch (err) {
    log.error(chalk.red(`Erro: ${err}`));
  }
};

//Estruturando teste unitário
const unitaryTest = async (testsPath: string) => {
  //Estruturando pastas para o teste
  const pathUnitaryTest = path.join(testsPath, 'unit');
  fs.mkdirSync(pathUnitaryTest, { recursive: true });

  //Estrutura do teste báse
  const helloTest = path.join(pathUnitaryTest, "hello.test.ts");
  const testeData = `import { describe, it, expect } from "vitest";
import { hello } from "../../commands/hello.js";

// Este é um exemplo de teste inicial
// Você pode adaptar esse bloco para testar a saída real do seu comando

  describe("Hello command",  () => {
  it("should print 'Olá, mundo!'", async () => {
    const result = await hello();
    expect(result).toBeUndefined();
   });
 });`

 fs.writeFileSync(helloTest, testeData, 'utf-8');

};

const integrationTest = async (testsPath: string) => {
  const pathIntegrationTest = path.join(testsPath, 'integration');
  fs.mkdirSync(pathIntegrationTest, { recursive: true });
};

const systemTest = async (testsPath: string) => {
  const pathSystemTest = path.join(testsPath, 'e2e');
  fs.mkdirSync(pathSystemTest, { recursive: true });
};
