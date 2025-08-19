import { describe, it, expect } from 'vitest';
import { processArgs } from '../../src/core/detailsDevPilot.js';

describe('processArgs', async () => {
  it('Deve retornar true para argumentos válidos - (--help)', async () => {
    const argv = ['node', 'devpilot.js', '--help'];
    const result = await processArgs(argv);
    expect(result).toBe(true);
  });

  it('Deve retornar true para argumento válido - (--version | --v)', async () => {
    const argv = ['node', 'devpilot.js', '--version'];
    const result = await processArgs(argv);
    expect(result).toBe(true);
  });

});
