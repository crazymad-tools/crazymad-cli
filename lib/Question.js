const inquirer = require('inquirer');

class Question {
  constructor () { }

  async initPorjectQuestion (option) {
    let prompt = inquirer.createPromptModule();
    let answer = await prompt([{
      type: 'input',
      name: 'name',
      default: option.projectName
    }, {
      type: 'input',
      name: 'version',
      default: '0.0.1'
    }, {
      type: 'input',
      name: 'template',
      default: option.template ? option.template : 'base'
    }, {
      type: 'input',
      name: 'author'
    }, {
      type: 'input',
      name: 'git repository'
    }, {
      type: 'description',
      name: 'description'
    }, {
      type: 'input',
      name: 'license',
      default: 'ISC'
    }]);
    return {
      projectName: answer['name'],
      version: answer['version'],
      templateName: answer['template'],
      git: answer['git repository'],
      author: answer['author'],
      description: answer['description'],
      license: answer['license']
    }
  }    
}

module.exports = new Question();