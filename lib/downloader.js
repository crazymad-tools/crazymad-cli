const fs = require('fs');
const download = require('download');

async function downloadTemplate (name) {
  let url = `https://raw.githubusercontent.com/crazymad-tools/crazymad-cli-template/master/templates/${name}.zip`;
  await new Promise((resolve, reject) => {
    download(url, process.cwd()).then(() => {
      console.log('done');
      resolve();
    });
  })
}

downloadTemplate('base');