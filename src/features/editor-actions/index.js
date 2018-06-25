import Selection from '../selection';
import EditorActions from './EditorActions';

export default {
  __depends__: [ Selection ],
  __init__: [ 'editorActions' ],
  editorActions: [ 'type', EditorActions ]
};