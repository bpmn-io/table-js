import CutPaste from '../cut-paste';
import Selection from '../selection';
import EditorActions from './EditorActions';

export default {
  __depends__: [ CutPaste, Selection ],
  __init__: [ 'editorActions' ],
  editorActions: [ 'type', EditorActions ]
};