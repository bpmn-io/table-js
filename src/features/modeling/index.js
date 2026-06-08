import CommandStack from 'diagram-js/lib/command/CommandStack.js';
import Modeling from './Modeling.js';

/**
 * @type { import('didi').ModuleDeclaration }
 */
export default {
  __init__: [
    'modeling'
  ],
  modeling: [ 'type', Modeling ],
  commandStack: [ 'type', CommandStack ]
};