import ChangeSupport from './ChangeSupport.js';
import Components from './Components.js';
import Renderer from './Renderer.js';

/**
 * @type { import('didi').ModuleDeclaration }
 */
export default {
  __init__: [ 'changeSupport', 'components', 'renderer' ],
  changeSupport: [ 'type', ChangeSupport ],
  components: [ 'type', Components ],
  renderer: [ 'type', Renderer ]
};