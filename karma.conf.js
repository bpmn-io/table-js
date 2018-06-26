'use strict';

// configures browsers to run test against
// any of [ 'ChromeHeadless', 'Chrome', 'Firefox', 'IE' ]
var TEST_BROWSERS = (
  (process.env.TEST_BROWSERS || 'ChromeHeadless')
    .replace(/^\s+|\s+$/, '')
    .split(/\s*,\s*/g)
);

process.env.CHROME_BIN = require('puppeteer').executablePath();

// workaround https://github.com/GoogleChrome/puppeteer/issues/290
if (process.platform === 'linux') {
  TEST_BROWSERS = TEST_BROWSERS.map(function(browser) {
    if (browser === 'ChromeHeadless') {
      return 'ChromeHeadless_Linux';
    } else {
      return browser;
    }
  });

}


module.exports = function(karma) {
  karma.set({

    frameworks: [
      'mocha',
      'sinon-chai'
    ],

    files: [
      'test/spec/**/*Spec.js'
    ],

    preprocessors: {
      'test/spec/**/*Spec.js': [ 'webpack' ]
    },

    reporters: [ 'spec' ],

    browsers: TEST_BROWSERS,

    browserNoActivityTimeout: 30000,

    singleRun: true,
    autoWatch: false,

    customLaunchers: {
      ChromeHeadless_Linux: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ],
        debug: true
      }
    },

    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: 'babel-loader'
          },
          {
            test: /\.css|\.dmn$/,
            use: 'raw-loader'
          }
        ]
      },
      resolve: {
        mainFields: [
          'dev:module',
          'browser',
          'module',
          'main'
        ],
        modules: [
          'node_modules',
          __dirname
        ]
      }
    }
  });

};
