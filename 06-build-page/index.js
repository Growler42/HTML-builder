const path = require('path');
const fs = require('fs');
const {readFile, readdir, rm} = require('fs/promises');
const {mkdir, stat, copyFile} = require('fs');

const projectDistPath = path.resolve(__dirname, 'project-dist');
const componentsPath = path.resolve(__dirname, 'components');
const stylesPath = path.resolve(__dirname, 'styles');
const filesPath = path.resolve(__dirname, 'assets');
const filesCopyPath = path.resolve(projectDistPath, 'assets');

const isErrCallback = err => {
  if (err) {
    console.error(err);
  }
};

mkdir(projectDistPath, {recursive: true}, isErrCallback);

const HTMLWriteStream = fs.createWriteStream(path.resolve(projectDistPath, 'index.html'), 'utf-8');
const HTMLReadStream = fs.createReadStream(path.resolve(__dirname, 'template.html'), 'utf-8');
HTMLReadStream.on('data', async (chunk) => {
  let template = chunk.toString();
  const matches = [...template.toString().matchAll(/{{([\s\S]+?)}}/g)];
  for (let match of matches) {
    const text = await readFile(path.resolve(componentsPath, `${match[1]}.html`), 'utf8');
    template = template.toString().replace(match[0], text.toString());
  }
  HTMLWriteStream.write(template.toString());
});

const StylesWriteStream = fs.createWriteStream(path.resolve(projectDistPath, 'style.css'));

fs.readdir(stylesPath, (err, files) => {
  isErrCallback(err);
  files.reverse();
  for (const file of files) {
    stat(path.resolve(stylesPath, file), async (err, stats) => {
      isErrCallback(err);
      if (stats.isFile() && path.extname(file) === '.css') {
        const readStream = await readFile(path.resolve(stylesPath, file), 'utf-8');
        StylesWriteStream.write('\n' + readStream + '\n');
      }
    });
  }
});

const copyAssets = (filePath, newFilePath) => {
  readdir(filePath)
    .then((items) => {
      for (const item of items) {
        stat(path.resolve(filePath, item), async (err, stats) => {
          isErrCallback(err);
          if (stats.isDirectory()) {
            mkdir(path.resolve(newFilePath, item), {recursive: true}, isErrCallback);
            copyAssets(path.resolve(filePath, item), path.resolve(newFilePath, item));
          } else if (stats.isFile()) {
            copyFile(path.resolve(filePath, item),
              path.resolve(newFilePath, item), isErrCallback);
          }
        });
      }
    })
    .catch(isErrCallback);
};

rm(filesCopyPath, {recursive: true, force: true}).then(() => {
  mkdir(filesCopyPath, {recursive: true}, isErrCallback);
  copyAssets(filesPath, filesCopyPath);
}).catch(isErrCallback);