import { program } from 'commander';
import {offset} from "./offset.js";

program.command('offset')
  .description('Add a positive or negative offset to a SRT file')
  .argument('<pathToSRT>', 'the path of the SRT File')
  .option('-a, --amount <amount>', 'amount of milliseconds to add or remove')
  .option('-o, --output <outpuPath>', 'the output path')
  .action(async (pathToSRT, options) => {
    const amount = parseInt(options.amount, 10)
    const outputPath = options.output || pathToSRT.replace(/\.srt$/, '.new.srt')
    await offset(pathToSRT, outputPath, amount);
  });

export { program }
