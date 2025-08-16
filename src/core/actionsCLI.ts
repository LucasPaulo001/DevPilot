import { publishInNPM } from "../commands/publish.js";

export const processArgsAction = async (argv: string[]): Promise<boolean> => {
  try {
    const args = argv.slice(2);

    if (args.includes('--publish-npm')) {
      await publishInNPM();
      process.exit(0);
    }
  } catch (err: any) {
    console.error(`Erro: ${err}`);
  }

  return false;
};
