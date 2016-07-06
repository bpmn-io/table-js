'use strict';

var debounce = require('lodash/function/debounce');
var DEBOUNCE_DELAY = 300;

function EditBehavior(
    eventBus,
    selection,
    sheet,
    elementRegistry,
    modeling,
    rules,
    graphicsFactory,
    keyboard,
    commandStack,
    tableName) {

  var replaceFct = function(text) {
    return text
      .replace(/<div><br><\/div>/ig, '\n')  // replace div with a br with single linebreak
      .replace(/<br(\s*)\/*>/ig, '\n')      // replace single line-breaks
      .replace(/<(div|p)(\s*)\/*>/ig, '\n') // add a line break before all div and p tags
      .replace(/&nbsp;/ig, ' ')             // replace non breaking spaces with normal spaces
      .replace(/(<([^>]+)>)/ig, '');        // remove any remaining tags
  };

  var sanitizeInput = function(text) {
    var encodedString = replaceFct(text).trim();

    // create an temporary textarea to translate html entities to normal chars
    var textArea = document.createElement('textarea');
        textArea.innerHTML = encodedString;
    return textArea.value;
  };

  var sanitizeInputWithoutTrim = function(text) {
    var encodedString = replaceFct(text);

    // create an temporary textarea to translate html entities to normal chars
    var textArea = document.createElement('textarea');
        textArea.innerHTML = encodedString;
    return textArea.value;
  };

  eventBus.on('element.focus', function(event) {
    if (rules.allowed('cell.edit', {
      row: event.element.row,
      column: event.element.column,
      content: event.element.content
    }) && !event.element.row.isFoot &&
          !event.element.complex) {

      event.gfx.childNodes[0].focus();

      var element = event.element;

      selection.select(element);

      // select the content of the focused cell
      var sel = window.getSelection();
      sel.selectAllChildren(event.gfx.childNodes[0]);

      // IE has execCommand, but throws an Exception when trying to use it with
      // enableInlineTableEditing
      // We need this line so that FF does not screw us with its build in
      // table editing features
      try {
        document.execCommand('enableInlineTableEditing', false, 'false');
      } catch(e) {
        // only catch the IE error
        if (e.description !== 'Invalid argument.') {
          // rethrow all other errors
          throw e;
        }
      }
    }
  });

  eventBus.on('element.mousedown', function(event) {
    if (rules.allowed('cell.edit', {
      row: event.element.row,
      column: event.element.column,
      content: event.element.content
    }) && !event.element.row.isFoot &&
          selection.get() !== event.element &&
          !event.element.complex) {

      selection.select(event.element);

      // ensure that we get a focus event afterwards
      // prevent chrome from firing a buildin focus event
      event.preventDefault();
      // cause all browsers to focus the child node
      event.gfx.childNodes[0].focus();
    }
  });

  eventBus.on('element.blur', function(event) {
    var element = event.element;

    if (selection.isSelected(element)) {
      selection.deselect();
    }
  });

  eventBus.on('element.input', debounce(function(event) {
    var element = event.element;
    var gfx = elementRegistry.getGraphics(event.element);
    if (selection.isSelected(element) && !element.preventAutoUpdate) {

      modeling.editCell(element.row.id, element.column.id, sanitizeInputWithoutTrim(gfx.innerHTML));

    }
  }, DEBOUNCE_DELAY));

  eventBus.on('selection.changed', function(event) {
    if (event.oldSelection) {
      // apply changes of the diagram to the model
      var gfxOld = elementRegistry.getGraphics(event.oldSelection);
      if (gfxOld) {
        if(!event.oldSelection.preventAutoUpdate) {
          modeling.editCell(event.oldSelection.row.id, event.oldSelection.column.id, sanitizeInput(gfxOld.innerHTML));
        }
        graphicsFactory.update('row', event.oldSelection.row, elementRegistry.getGraphics(event.oldSelection.row));
        graphicsFactory.update('column', event.oldSelection.column,
                elementRegistry.getGraphics(event.oldSelection.column));
      }
    }
    if (event.newSelection) {
      graphicsFactory.update('cell', event.newSelection, elementRegistry.getGraphics(event.newSelection));
      graphicsFactory.update('row', event.newSelection.row, elementRegistry.getGraphics(event.newSelection.row));
      graphicsFactory.update('column', event.newSelection.column,
              elementRegistry.getGraphics(event.newSelection.column));
    }
  });

  var nameFocus = false;
  var nameElement = null;
  eventBus.on('tableName.init', function(event) {
    if (rules.allowed('name.edit')) {

      nameElement = event.node;

      eventBus.fire('tableName.allowEdit', {
        editAllowed: true
      });

      event.node.setAttribute('contenteditable', true);

      event.node.addEventListener('focus', function(evt) {
        nameFocus = true;
      }, true);
      event.node.addEventListener('blur', function(evt) {
        nameFocus = false;
        var newName = sanitizeInput(evt.target.innerHTML);
        if (newName !== tableName.getName()) {
          modeling.editName(newName);
        }
      }, true);
    }
  });

  if (keyboard) {
    keyboard._listeners.unshift(function(key, modifiers) {
      if(key === 13) {
        var evt = modifiers;
        if(modifiers.ctrlKey || modifiers.metaKey) {
          // standard behavior (linebreak) on ctrl+enter
          // http://stackoverflow.com/a/12957539/4582955
            var selectObj = document.getSelection();
            var range = selectObj.getRangeAt(0);

            var br = document.createElement('br'),
                textNode = document.createTextNode('\u00a0');
                    //Passing ' ' directly will not end up being shown correctly

            range.deleteContents();             // delete the selection
            range.insertNode(br);               // add a linebreak
            range.collapse(false);              // go after the linebreak
            range.insertNode(textNode);         // add a whitespace (so the linebreak gets displayed)
            range.collapse(true);               // place cursor before whitespace

            // update the selection with the new range
            selectObj.removeAllRanges();
            selectObj.addRange(range);

        } else if(modifiers.shiftKey) {
          evt.preventDefault();
          selection.selectAbove();
        } else {
          evt.preventDefault();
          selection.selectBelow();
        }
      }
    });
  }
}

EditBehavior.$inject = [
  'eventBus',
  'selection',
  'sheet',
  'elementRegistry',
  'modeling',
  'rules',
  'graphicsFactory',
  'keyboard',
  'commandStack',
  'tableName' ];

module.exports = EditBehavior;
