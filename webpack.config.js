//@ts-check

'use strict';

const path = require('path');

/**@type {import('webpack').Configuration}*/
const config = {
  target: 'node',

  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]'
  },
  devtool: 'source-map',
  externals: {
    vscode: 'commonjs vscode'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  }
};
module.exports = config;
