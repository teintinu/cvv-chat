const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'built');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
var BrowserConsoleBuildErrorPlugin = require('browser-console-build-error-webpack-plugin');

const config = {
  // Entry points to the project
  entry: [
    'webpack/hot/dev-server',
    'webpack/hot/only-dev-server',
    path.join(__dirname, '/src/app/app.tsx'),
  ],
  // Server Configuration options
  devServer: {
    contentBase: 'src/www', // Relative directory for base of server
    devtool: 'eval',
    hot: true, // Live-reload
    inline: true,
    port: 4000, // Port Number
    host: 'localhost', // Change to '0.0.0.0' for external facing server
  },
  debug: true,
  devtool: 'eval',
  output: {
    path: buildPath, // Path of output file
    filename: 'bundle.js',
  },
  plugins: [
    BrowserConsoleBuildErrorPlugin,
    // Enables Hot Modules Replacement
    new webpack.HotModuleReplacementPlugin(),
    // Allows error warnings but does not stop compiling.
    new webpack.NoErrorsPlugin(),
    // Moves files
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

module.exports = config;
