const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
  output: {
    path: path.resolve(__dirname, '../dist/js'),
    filename: 'bundle-[hash].js'
  }
});
