const path = require('path');
const {readdir} = require('fs/promises');
const {stat} = require('fs');

const secretPath = path.resolve(__dirname, 'secret-folder');

const header = '-'.repeat(43) + '\n'
  + 'name\t|\text\t|\tsize(bytes)' + '\n'
  + '-'.repeat(43);

readdir(secretPath)
  .then((files) => {
    console.log(header);
    for (const file of files) {
      stat(path.resolve(secretPath, file), (err, stats) => {
        if (stats.isFile()) {
          const f = path.parse(file);
          console.log(`${f.name}\t-\t${f.ext}\t-\t${stats.size}`);
        }
      });
    }
  })
  .catch(err => console.error(err));