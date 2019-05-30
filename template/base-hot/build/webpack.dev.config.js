const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
  devServer: {
    publicPath: '/',
    hot: true,
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'static'),
    stats: "errors-only",
    port: '8085',
    open: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});
