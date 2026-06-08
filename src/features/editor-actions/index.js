import Selection from '../selection/index.js';
import EditorActions from './EditorActions.js';

/**
 * @type { import('didi').ModuleDeclaration }
 */
export default {
  __depends__: [ Selection ],
  __init__: [ 'editorActions' ],
  editorActions: [ 'type', EditorActions ]
};