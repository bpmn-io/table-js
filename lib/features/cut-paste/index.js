import Clipboard from '../clipboard';
import CutPaste from './CutPaste';

export default {
  __depends__: [ Clipboard ],
  __init__: [ 'cutPaste' ],
  cutPaste: [ 'type', CutPaste ]
};