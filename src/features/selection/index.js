import Selection from './Selection';
import SelectionBehavior from './SelectionBehavior';

/**
 * @type { import('didi').ModuleDeclaration }
 */
export default {
  __init__: [ 'selection', 'selectionBehavior' ],
  selection: [ 'type', Selection ],
  selectionBehavior: [ 'type', SelectionBehavior ]
};