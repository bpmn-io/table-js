import TestRules from './TestRules';
import Rules from 'src/features/rules';

export default {
  __depends__: [ Rules ],
  __init__: [ 'testRules' ],
  testRules: [ 'type', TestRules ]
};