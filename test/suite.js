import './globals.js';

var allTests = import.meta.webpackContext('.', {
  recursive: true,
  regExp: /spec.*Spec\.js$/
});

allTests.keys().forEach(allTests);