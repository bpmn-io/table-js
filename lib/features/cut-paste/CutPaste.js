import CutHandler from './cmd/CutHandler';
import PasteHandler from './cmd/PasteHandler';

export default class CutPaste {
  constructor(clipBoard, commandStack, modeling, sheet) {
    this._clipBoard = clipBoard;
    this._commandStack = commandStack;
    this._modeling = modeling;
    this._sheet = sheet;

    commandStack.registerHandler('cut', CutHandler);
    commandStack.registerHandler('paste', PasteHandler);
  }

  cut(element) {
    const context = {
      element
    };

    this._commandStack.execute('cut', context);
  }

  pasteBefore(element) {
    const context = {
      element,
      before: true
    };

    this._commandStack.execute('paste', context);
  }
  
  pasteAfter(element) {
    const context = {
      element,
      after: true
    };

    this._commandStack.execute('paste', context);
  }
}

CutPaste.$inject = [ 'clipBoard', 'commandStack', 'modeling', 'sheet' ];