import TestRules from './TestRules.js';
import Rules from 'table-js/lib/features/rules';

export default {
  __depends__: [ Rules ],
  __init__: [ 'testRules' ],
  testRules: [ 'type', TestRules ]
};