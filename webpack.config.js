const ExternalsHelperPlugin = require('webpack-babel-external-helpers-2');

const webpack = require('webpack');

const path = require('path');
const fs = require('fs');

const banner = fs.readFileSync('resources/banner.txt', 'utf-8');
const bannerMin = fs.readFileSync('resources/banner-min.txt', 'utf-8');

function processBanner(banner) {

  var now = new Date();

  var pkgDate = [ now.getFullYear(), now.getMonth() + 1, now.getDate() ].join('-');
  var pkgVersion = require('./package').version;

  return (
    banner
      .replace(/\[pkgDate\]/, pkgDate)
      .replace(/\[pkgVersion\]/, pkgVersion)
  );
}

module.exports = {
  entry: {
    'table': [ './lib/Table.js' ],
    'table.min': [ './lib/Table.js' ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            [ 'env', {
              loose: true,
              modules: false
            } ]
          ],
          plugins: [
            'external-helpers',
            'transform-object-assign',
            'transform-object-rest-spread'
          ]
        }
      }
    ],
    noParse: /sax/
  },
  node: {
    global: true
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'TableJS',
    libraryTarget: 'umd'
  },
  plugins: [
    new ExternalsHelperPlugin({
      whitelist: [
        'classCallCheck',
        'inherits',
        'typeof',
        'possibleConstructorReturn',
        'extends',
        'objectWithoutProperties'
      ]
    }),
    new webpack.BannerPlugin({
      include: /\.min\.js$/,
      banner: processBanner(bannerMin)
    }),
    new webpack.BannerPlugin({
      exclude: /\.min\.js$/,
      banner: processBanner(banner)
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      parallel: true
    })
  ],
  devtool: 'source-map'
};