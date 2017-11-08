import Components from './Components';
import Renderer from './Renderer';

export default {
  __init__: [ 'components', 'renderer' ],
  components: [ 'type', Components ],
  renderer: [ 'type', Renderer ]
};