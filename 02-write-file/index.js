const path = require('path');
const fs = require('fs');
const {stdin: input, stdout: output} = require('process');
const readline = require('readline');

const writeStream = fs.createWriteStream(path.resolve(__dirname, 'text.txt'));
const rl = readline.createInterface({input, output});
const underline = number => '-'.repeat(number);
process.stdout.write(`\n${underline(13)}\n Enter data:\n${underline(13)}\n\n`);

rl.on('line', (line) => {
  if (line === 'exit') {
    rl.close();
  } else {
    writeStream.write(line + '\n');
  }
});

rl.on('close', () => {
  console.log(`\n${underline(37)}\n Goodbye! Your data in text.txt file\n${underline(37)}\n`);
});
