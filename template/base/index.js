/**
 * 基础模板
 */
const fs = require('fs');
const path = require('path');

module.exports = {
  folder: {
    'src': {
      'main.js': 'main.js'
    },
    'build': {
      'build.js': 'build.js',
      'webpack.config.js': 'webpack.config.js'
    },
    'dist': {},
    'index.html': 'index.html',
    'package.json': 'package.json'
  },
  dev: true,
  css: true,
  scss: true,
  plugins: [
    (option) => {
      let { projectPath, projectName } = option;
      let filename = path.resolve(projectPath, 'index.html');
      let html = fs.readFileSync(filename, 'utf-8');
      html = html.replace('{{name}}', option.projectName);
      fs.writeFileSync(filename, html, 'utf-8', 'w');
    },
    (option) => {
      filename = path.resolve(option.projectPath, 'package.json');
      let json = fs.readFileSync(filename, 'utf-8');
      json = json.replace('{{author}}', option.author);
      json = json.replace('{{name}}', option.projectName);
      json = json.replace('{{version}}', option.version);
      json = json.replace('{{description}}', option.description);
      json = json.replace('{{license}}', option.license);
      fs.writeFileSync(filename, json, 'utf-8', 'w');
    }
  ]
};