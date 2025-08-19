import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { generateArchive } from "../../src/core/createCLI.js";

vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

describe('generateArchive', () => {
  it('gera README.md corretamente', async () => {
    await generateArchive('readme', 'meu-cli');
    const filePath = path.join(process.cwd(), 'meu-cli', 'README.md');
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      filePath,
      expect.stringContaining('Gerado pelo Devpilot-core'),
      'utf-8',
    );
  });
});
