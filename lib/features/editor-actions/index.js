import CutPaste from '../cut-paste';
import Modeling from '../modeling';
import Selection from '../selection';
import EditorActions from './EditorActions';

export default {
  __depends__: [ CutPaste, Modeling, Selection ],
  __init__: [ 'editorActions' ],
  editorActions: [ 'type', EditorActions ]
};