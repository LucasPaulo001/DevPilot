import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createCLI } from '../../src/core/createCLI.js';
import * as prompts from '@clack/prompts';

// Mock do prompts primeiro
vi.mock('@clack/prompts', () => ({
  text: vi.fn().mockResolvedValue('meu-cli'),
  multiselect: vi.fn().mockResolvedValue([]),
  intro: vi.fn(),
  outro: vi.fn(),
  log: { info: vi.fn(), success: vi.fn() },
  select: vi.fn()
}));

let tempDir = '';

describe('createCLI - integração', () => {
  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(process.cwd(), 'tmp-cli-'));
    process.chdir(tempDir);
  });

  afterEach(() => {
    process.chdir(__dirname);
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('cria estrutura de diretórios e arquivos', async () => {
    vi.spyOn(prompts, 'text').mockResolvedValue('meu-cli');
    vi.spyOn(prompts, 'multiselect').mockResolvedValue([]);

    await createCLI();

    expect(fs.existsSync(path.join(tempDir, 'meu-cli', 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, 'meu-cli', 'devpilot.config.yaml'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, 'meu-cli', 'src', 'cli', 'index.ts'))).toBe(true);
  }, 60000);
});
