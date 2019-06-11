#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ignore = require('ignore');
const rimraf = require('rimraf');
const copydir = require('copy-dir');
const program = require('commander');
const archiver = require('archiver');

let inputName = null;
let ouputName = null;
let tmpFolderPath = randomPath();
let ignoreList = null;

program
  .version(require('../package').version)
  .arguments('<input> [output]')
  .action(function (input, output) {
    inputName = input;
    outputName = output;
  })
  .option('-D --debug', 'open debug mode')
  .parse(process.argv);

/**
 * 校验并处理命令行参数
 */
function checkCommander () {
  if (!inputName || !outputName) {
    console.log('please enter folder name and zip name');
    exit();
    process.exit();
  }
  inputName = path.resolve(process.cwd(), inputName);
  outputName = path.resolve(process.cwd(), outputName);
}

/**
 * 将文本按行分割
 * @param {String} text 文本
 */
function readLine (text) {
  let list = [];
  let tmp = text.split(/[\n\r]+/i);
  tmp.forEach(line => {
    line = line.trim();
    if (line.match(/^\#+/i) === null) {
      list.push(line);
    }
  });

  return list;
}

/**
 * 在当前工作目录下生成一个随机目录路径
 */
function randomPath () {
  let tmp = new Date().getTime();
  tmp = tmp.toString(16);
  tmp = path.resolve(process.cwd(), tmp);
  fs.mkdirSync(tmp);

  return tmp;
}

/**
 * 判断文件夹是否存在
 * @param {String} filenamePath 文件夹路径名
 */
function isExisted (folderPath, mkdir) {
  if (!fs.existsSync(folderPath)) {
    if (!mkdir) {
      console.log(`${folderPath} not existed`);
      exit();
      process.exit();
    }
    fs.mkdirSync(folderPath);
    return fs.readdirSync(folderPath); 
  } else {
    return fs.readdirSync(folderPath);
  }
}

/**
 * 拷贝模板文件到临时文件中
 */
function copy (from, to) {
  const ig = ignore().add(ignoreList);
  copydir.sync(from, to, {
    cover: true,
    mode: true,
    filter: (stat, filename, filepath) => {
      let offsetFilename = filename.slice(inputName.length + 1);
      if (offsetFilename !== '' && ig.ignores(offsetFilename)) {
        return false;
      }
      return true;
    }
  });
}

/**
 * 生成zip文件
 */
async function output2Zip () {
  const archive = archiver('zip', {
    zlib: {
      level: 9
    }
  });
  const stream = fs.createWriteStream(outputName + '.zip');

  return await new Promise((resolve, reject) => {
    archive
      .directory(tmpFolderPath, false)
      .on('error', err => reject(err))
      .pipe(stream);
    
    stream.on('close', () => {
      console.log('finish');
      exit();
      resolve()
    });
    archive.finalize();
  });
}

/**
 * 程序终止时需要处理的事情
 */
function exit () {
  // 调试模式下，不删除临时文件夹
  if (program.debug) {
    return;
  }
  rimraf(tmpFolderPath, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

function makeConfig () {
  let filename = path.resolve(__dirname, '../resources/cmconfig.js');
  let config = fs.readFileSync(filename, 'utf-8');
  filename = path.resolve(tmpFolderPath, 'cmconfig.js');
  // console.log(filename);
  // console.log(config);
  fs.writeFileSync(filename, config, 'utf-8', 'w');
}

async function main () {
  // 校验处理命令行参数
  checkCommander();
  
  let ignoreFile = path.resolve(inputName, '.cmignore');
  ignoreFile = fs.readFileSync(ignoreFile, 'utf-8');
  ignoreList = readLine(ignoreFile);
  ignoreList.push('.cmignore');

  // create temp folder
  isExisted(inputName);

  // copy template file to temp folder
  copy(inputName, tmpFolderPath);

  // make crazymad-cli template config file
  makeConfig();

  // create template zip file
  output2Zip();

}

try {
  main();
} catch (err) {
  exit();
}
