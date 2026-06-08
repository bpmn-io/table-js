import CommandStack from 'diagram-js/lib/command/CommandStack';
import Modeling from './Modeling';

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