const webpack = require('webpack');
const path = require('path');
const TransferWebpackPlugin = require('transfer-webpack-plugin');

module.exports = function config(builtPath) {
  const buildPath = path.resolve(__dirname, builtPath);
  console.log('buildPath: '+buildPath)
  return {
    entry: [
      path.join(__dirname, '/src/app/app.tsx'),
    ],
    output: {
      path: buildPath, 
      filename: 'bundle.js',
    },
    plugins: [
      new TransferWebpackPlugin([
        {from: 'www'},
      ], path.resolve(__dirname, 'src')),
    ],
    resolve: {
      extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },  
    module: {
      loaders: [
        {
          test: /\.ts(x?)$/,
          loader: 'babel-loader?presets[]=es2016&presets[]=es2015&presets[]=react!ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.js$/,
          loader: 'babel-loader?presets[]=es2016&presets[]=es2015&presets[]=react',
          exclude: /node_modules/,
        },
      ],
    },
  };
}