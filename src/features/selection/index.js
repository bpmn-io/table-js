import Selection from './Selection.js';
import SelectionBehavior from './SelectionBehavior.js';

/**
 * @type { import('didi').ModuleDeclaration }
 */
export default {
  __init__: [ 'selection', 'selectionBehavior' ],
  selection: [ 'type', Selection ],
  selectionBehavior: [ 'type', SelectionBehavior ]
};