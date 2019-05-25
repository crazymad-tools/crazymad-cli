#!/usr/bin/env node
const path = require('path');
const ora = require('ora');
const program = require('commander');
const chalk = require('chalk');
const childProcess = require('child_process')
const FolderCreator = require('../lib/FolderCreator');
const question = require('../lib/Question');

program
  .version(require('../package').version)
  .option('init', 'init a project')
  .option('-T, --template [String]', 'create from template')
  .option('-N, --name [String]', 'input project name')
  .parse(process.argv);

async function main () {
  let projectPath = process.cwd();
  let projectName = path.basename(projectPath);
  let templateName = program.template;
  
  if (program.init === true) {
    if (program.name) {
      projectName = program.name;
      projectPath = path.resolve(projectPath, projectName);
    }
    
    let answer = await question.initPorjectQuestion({
      projectName: projectName,
      templateName: templateName
    });

    chalk.green(`create project ${projectName}`);
    let creator = new FolderCreator({
      projectName: answer.projectName,
      projectPath: projectPath,
      template: answer.templateName,
      author: answer.author,
      license: answer.license,
      git: answer.git,
      description: answer.description,
      version: answer.version
    });

    creator.init();
    let cmd = `cd ${projectPath} && npm install`;
    const spinner = ora('npm install ...');
    spinner.start();
    childProcess.exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.log(stderr);
        console.log(chalk.red(err));
      } else {
        console.log(stdout);
        spinner.stop();
        console.log(chalk.green('install finished.'));
      }
    });
  }
}


main();


