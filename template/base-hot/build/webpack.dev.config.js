const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
  devServer: {
    publicPath: '/',
    hot: true,
    historyApiFallback: true,
    proxy: {
      "^/webapi/**": {
        target: process.env.TARGET || 'http://dev.hlp.fun:80',
        changeOrigin: true,
      }
    },
    contentBase: path.join(__dirname, 'app/build'),
    stats: "errors-only",
    port: '8085'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});
