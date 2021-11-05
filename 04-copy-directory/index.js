const path = require('path');
const {mkdir, copyFile, unlink} = require('fs');
const {readdir} = require('fs/promises');

const filesPath = path.resolve(__dirname, 'files');
const filesCopyPath = path.resolve(__dirname, 'files-copy');

const isErrCallback = err => {
  if (err) {
    console.error(err);
  }
};

mkdir(filesCopyPath, {recursive: true}, isErrCallback);

let filesArr = [];

readdir(filesPath)
  .then((files) => {
    filesArr = files;
    for (const file of files) {
      copyFile(path.resolve(filesPath, file),
        path.resolve(filesCopyPath, file), isErrCallback);
    }
  })
  .catch(isErrCallback);

readdir(filesCopyPath)
  .then((files) => {
    for (const file of files) {
      if (filesArr.indexOf(file) === -1) {
        unlink(path.resolve(filesCopyPath, file), isErrCallback);
      }
    }
  })
  .catch(isErrCallback);