/* global require */

import './globals.js';

var allTests = require.context('.', true, /spec.*Spec\.js$/);

allTests.keys().forEach(allTests);