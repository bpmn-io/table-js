'use strict';


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

  var sanitizeInput = function(text) {
    var encodedString = text
    .replace(/<div><br><\/div>/ig, '\n')  // replace div with a br with single linebreak
    .replace(/<br(\s*)\/*>/ig, '\n')      // replace single line-breaks
    .replace(/<(div|p)(\s*)\/*>/ig, '\n') // add a line break before all div and p tags
    .replace(/(<([^>]+)>)/ig, '').trim(); // remove any remaining tags

    // create an temporary textarea to translate html entities to normal chars
    var textArea = document.createElement('textarea');
        textArea.innerHTML = encodedString;
    return textArea.value;
  };

  eventBus.on('element.focus', function(event) {
    if(rules.allowed('cell.edit', {
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
        if(e.description !== 'Invalid argument.') {
          // rethrow all other errors
          throw e;
        }
      }
    }
  });

  eventBus.on('element.mousedown', function(event) {
    if(rules.allowed('cell.edit', {
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

    if(selection.isSelected(element)) {
      selection.deselect();
    }
  });

  eventBus.on('selection.changed', function(event) {
    if(event.oldSelection) {
      // apply changes of the diagram to the model
      var gfxOld = elementRegistry.getGraphics(event.oldSelection);
      if(gfxOld) {
        modeling.editCell(event.oldSelection.row.id, event.oldSelection.column.id, sanitizeInput(gfxOld.innerHTML));
        graphicsFactory.update('row', event.oldSelection.row, elementRegistry.getGraphics(event.oldSelection.row));
        graphicsFactory.update('column', event.oldSelection.column,
                elementRegistry.getGraphics(event.oldSelection.column));
      }
    }
    if(event.newSelection) {
      graphicsFactory.update('cell', event.newSelection, elementRegistry.getGraphics(event.newSelection));
      graphicsFactory.update('row', event.newSelection.row, elementRegistry.getGraphics(event.newSelection.row));
      graphicsFactory.update('column', event.newSelection.column,
              elementRegistry.getGraphics(event.newSelection.column));
    }
  });

  var nameFocus = false;
  var nameElement = null;
  eventBus.on('tableName.init', function(event) {
    if(rules.allowed('name.edit')) {

      nameElement = event.node;
      event.node.setAttribute('contenteditable', true);

      event.node.addEventListener('focus', function(evt) {
        nameFocus = true;
      }, true);
      event.node.addEventListener('blur', function(evt) {
        nameFocus = false;
        var newName = sanitizeInput(evt.target.innerHTML);
        if(newName !== tableName.getName()) {
          modeling.editName(newName);
        }
      }, true);
    }
  });

  if(keyboard) {
    // to react to keyboard events, commit work when stack actions will occur
    // HACK: Our handler needs a higher priority than the undo handler
    keyboard._listeners.unshift(function(key, modifiers) {
      if ((modifiers.ctrlKey || modifiers.metaKey) && !modifiers.shiftKey && key === 90) {
        if(nameFocus) {
          var newName = sanitizeInput(nameElement.innerHTML);
          if(newName !== tableName.getName()) {
            modeling.editName(newName);
          }
        }
        var selected = selection.deselect();
        selection.select(selected);

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
