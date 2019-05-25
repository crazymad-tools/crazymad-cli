/*
 * @author: crazy_mad
 * @Date: 2019-05-25 20:50:38
 * @Description: Create project folder and init tmeplate
 */

const template = require('./template');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

/**
 * create and build project
 */
class FolderCreator {
  constructor (option) {
    this.option = option;

    // default template: base
    this.templateName = option.template ? option.template : 'base';

    // template
    this.template = template[this.templateName];

    // project folder absolute path
    this.projectPath = option.projectPath;
    
    // project name
    this.projectName = option.projectName;

    // is inside project folder
    this.isInside = option.isInside;
  }

  /**
   * mkdir project folder
   * @param {String} name project name
   * @param {String} file current file/folder
   * @param {String} offset current relative folder offset
   */ 
  createProjectFolder (file, offset) {
    let templatePath = path.resolve(__dirname, '../template', this.templateName, offset);
    let currentPath = path.resolve(this.projectPath, offset);
    // create file or folder
    if (typeof file === 'string') {
      // check file is exists
      if (!fs.existsSync(currentPath)) {
        let content = fs.readFileSync(templatePath);
        fs.writeFileSync(currentPath, content, 'utf-8', 'w');
      }
    } else {
      // check folder is exsits
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath);
      }
      
      Object.keys(file).forEach(name => {
        this.createProjectFolder(file[name], path.join(offset, name));
      });
    }
  }

  /**
   * load template plugin function
   */
  loadPlugins () {
    this.template.plugins.forEach(func => {
      if (typeof func === 'function') {
        func(this.option);
      }
    });
  }

  /**
   * init project folder
   */
  init () {
    this.createProjectFolder(this.template.folder, '');
    this.loadPlugins();
  }
}

module.exports = FolderCreator;
