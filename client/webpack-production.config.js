var configure=require('./webpack-base')
const webpack = require('webpack');
var config = configure('built/public');

config.plugins = [
  new webpack.DefinePlugin({
    'process.env':{
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      // suppresses warnings, usually from module minification
      warnings: false,
    },
  }),
  new webpack.NoErrorsPlugin(),
].concat(config.plugins);

module.exports = config;