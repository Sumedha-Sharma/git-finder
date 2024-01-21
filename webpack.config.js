const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DotEnv = require('dotenv-webpack');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  entry: ["./src/styles.css", './src/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/', // Adjust based on your setup
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    static: {
      directory: __dirname,
    },
    compress: true,
    port: 8081,
    hot: true, // Enable Hot Module Replacement
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
    }),
    new DotEnv(),
    new NodePolyfillPlugin(),
  ],
};
