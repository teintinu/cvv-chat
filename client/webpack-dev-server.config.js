const webpack = require('webpack');
const WriteFilePlugin = require('write-file-webpack-plugin');

var configure=require('./webpack-base')
var config = configure('built/public');

config.entry = [
    'webpack/hot/dev-server', 
    'webpack/hot/only-dev-server'
  ].concat(config.entry);

config.plugins = [
    new WriteFilePlugin(),  
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoErrorsPlugin(),
    // BrowserConsoleBuildErrorPlugin
  ].concat(config.plugins);

config.devServer = {
  contentBase: 'src/www', // Relative directory for base of server
  devtool: 'source-map',
  hot: true, // Live-reload
  inline: true,
  port: 4000, // Port Number
  host: 'localhost', // Change to '0.0.0.0' for external facing server
  outputPath: config.output.path, 
};
config.debug= true;
config.devtool= 'source-map';

module.exports = config;