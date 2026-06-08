import Selection from '../selection';
import EditorActions from './EditorActions';

/**
 * @type { import('didi').ModuleDeclaration }
 */
export default {
  __depends__: [ Selection ],
  __init__: [ 'editorActions' ],
  editorActions: [ 'type', EditorActions ]
};