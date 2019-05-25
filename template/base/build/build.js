const webpackConfig = require('./webpack.config');
const webpack = require('webpack');
const ora = require('ora');
const chalk = require('chalk')

const spinner = ora('build production');
spinner.start();

webpack(webpackConfig, (err, status) => {
  spinner.stop();
  if (err) {
      throw err;
  }
  process.stdout.write(status.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n');

  if (status.hasErrors()) {
    console.log(chalk.red('  Build failed with errors.\n'));
    process.exit(1);
  }

  console.log(chalk.cyan('  Build complete.\n'));
  console.log(chalk.yellow(
    '  Tip: built files are meant to be served over an HTTP server.\n' +
    '  Opening index.html over file:// won\'t work.\n'
  ));
});
