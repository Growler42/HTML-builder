const path = require('path');
const {stat} = require('fs');
const {readdir} = require('fs/promises');
const fs = require('fs');

const projectPath = path.resolve(__dirname, 'project-dist');
const stylesPath = path.resolve(__dirname, 'styles');

const isErrCallback = err => {
  if (err) {
    console.error(err);
  }
};

const writeStream = fs.createWriteStream(path.resolve(projectPath, 'bundle.css'));

readdir(stylesPath)
  .then((files) => {
    for (const file of files) {
      stat(path.resolve(stylesPath, file), (err, stats) => {
        isErrCallback(err);
        if (stats.isFile() && path.extname(file)==='.css') {
          const readStream = fs.createReadStream(path.resolve(stylesPath, file), 'utf-8');
          readStream.pipe(writeStream);
        }
      });
    }
  })
  .catch(isErrCallback);