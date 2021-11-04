const path = require('path');
const fs = require('fs');
const {stdout} = require('process');

const stream = fs.createReadStream(path.resolve(__dirname, 'text.txt'), 'utf-8');

stream.on('open', function () {
  stream.pipe(stdout);
});

stream.on('error', function (err) {
  if (err.code === 'ENOENT') {
    console.log('File doesn\'t exist');
  } else {
    console.error(err);
  }
});