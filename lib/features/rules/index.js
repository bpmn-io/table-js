import ModelingRules from './ModelingRules';
import Rules from 'diagram-js/lib/features/rules';

export default {
  __depends__: [ Rules ],
  __init__: [ 'modelingRules' ],
  modelingRules: [ 'type', ModelingRules ]
};