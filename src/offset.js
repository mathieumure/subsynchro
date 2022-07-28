import fs from "fs";
import path from "path";
import { appendFile, unlink } from "fs/promises";
import { promisify } from 'util'
import readline from "readline";

const fileExists = promisify(fs.exists);

const padWith0 = amount => value => value.toString().padStart(amount, '0')
const pad2Digit = padWith0(2)
const pad3Digit = padWith0(3)

const REGEX = /(?<hours>\d+):(?<minutes>\d\d):(?<seconds>\d\d),(?<milliseconds>\d\d\d)/;

export const toMilliseconds = (timecode) => {
  const res = REGEX.exec(timecode);
  return parseInt(res.groups.milliseconds) + parseInt(res.groups.seconds) * 1000 + parseInt(res.groups.minutes)*60*1000 + parseInt(res.groups.hours)*60*60*1000
}

export const toTimeCode = (milliseconds) => {
  let residue = milliseconds;
  const hours = Math.floor(residue / (60*60*1000));
  residue -= hours * (60*60*1000)
  const minutes = Math.floor(residue / (60*1000))
  residue -= minutes * (60*1000)
  const seconds = Math.floor(residue / (1000))
  residue -= seconds * 1000;

  return `${pad2Digit(hours)}:${pad2Digit(minutes)}:${pad2Digit(seconds)},${pad3Digit(residue)}`
}

export const processBlock = (block, amount) => {
  const [counterLine, timingLine, ...subtitlesLines] = block;
  let [start, end] = timingLine.split(' --> ').map(toMilliseconds);
  start += amount;
  end += amount;

  return [
    counterLine,
    `${toTimeCode(start)} --> ${toTimeCode(end)}`,
    ...subtitlesLines
  ]
}

export async function offset (inputPath, outputPath, amount) {
  const fileStream = fs.createReadStream(inputPath);
  const rl = readline.createInterface({
    input: fileStream,
  });

  if (await fileExists(outputPath)) {
    await unlink(outputPath);
  }

  let currentBlock = []
  let lineNo = 0
  for await (const line of rl) {
    if (line !== '') {
      currentBlock.push(line);
    } else {
      const updatedBlock = processBlock(currentBlock, amount);
      await appendFile(outputPath, updatedBlock.join('\n') + '\n\n');
      currentBlock = [];
    }
  }
}
