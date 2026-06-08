import ChangeSupport from './ChangeSupport';
import Components from './Components';
import Renderer from './Renderer';

/**
 * @type { import('didi').ModuleDeclaration }
 */
export default {
  __init__: [ 'changeSupport', 'components', 'renderer' ],
  changeSupport: [ 'type', ChangeSupport ],
  components: [ 'type', Components ],
  renderer: [ 'type', Renderer ]
};