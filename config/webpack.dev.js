var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WatchIgnorePlugin = require('watch-ignore-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
var path = require('path');

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    new ExtractTextPlugin('[name].css'),
      new WatchIgnorePlugin([
          path.resolve(__dirname, '../src/assets/images/contacts'),
      ]),
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal',
      watchOptions: {
          ignored: 'assets/images/**/*.*'
      }
  },

});
