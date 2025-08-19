import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// Mock do módulo inteiro
vi.mock('@clack/prompts', () => {
  return {
    intro: vi.fn(),
    outro: vi.fn(),
    log: { info: vi.fn(), success: vi.fn() },
    text: vi.fn().mockResolvedValue('meu-cli'),
    multiselect: vi.fn().mockResolvedValue([]),
    select: vi.fn(),
  };
});

import { createCLI } from '../../src/core/createCLI';

describe('createCLI - E2E', () => {
  let tmp: string;

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(process.cwd(), 'tmp-cli-e2e-'));
    process.chdir(tmp);
  });

  afterEach(() => {
    process.chdir(__dirname);
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it('cria e builda o CLI completo', async () => {
    // Executa a função completa
    await createCLI();

    const cliPath = path.join(tmp, 'meu-cli');
    expect(fs.existsSync(path.join(cliPath, 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(cliPath, 'src', 'cli', 'index.ts'))).toBe(true);
  }, 60000);
});
