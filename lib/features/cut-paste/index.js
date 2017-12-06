import Clipboard from '../clipboard';
import Modeling from '../modeling';
import CutPaste from './CutPaste';

export default {
  __depends__: [ Clipboard, Modeling ],
  __init__: [ 'cutPaste' ],
  cutPaste: [ 'type', CutPaste ]
};