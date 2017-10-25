import CommandStack from 'diagram-js/lib/command/CommandStack';
import Modeling from './Modeling';

export default {
  __init__: [
    'modeling'
  ],
  modeling: [ 'type', Modeling ],
  commandStack: [ 'type', CommandStack ]
};