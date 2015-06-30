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
    commandStack) {

  eventBus.on('element.focus', function(event) {

    var element = event.element;

    selection.select(element);
  });

  eventBus.on('element.focusout', function(event) {

    var element = event.element;

    if(selection.isSelected(element)) {
      selection.deselect();
    }
  });

  eventBus.on('selection.changed', function(event) {
    if(event.oldSelection) {
      // apply changes of the diagram to the model
      var gfxOld = elementRegistry.getGraphics(event.oldSelection);

      modeling.editCell(event.oldSelection.row.id, event.oldSelection.column.id, gfxOld.textContent);
      graphicsFactory.update('row', event.oldSelection.row, elementRegistry.getGraphics(event.oldSelection.row));
      graphicsFactory.update('column', event.oldSelection.column,
              elementRegistry.getGraphics(event.oldSelection.column));
    }
    if(event.newSelection) {
      graphicsFactory.update('cell', event.newSelection, elementRegistry.getGraphics(event.newSelection));
      graphicsFactory.update('row', event.newSelection.row, elementRegistry.getGraphics(event.newSelection.row));
      graphicsFactory.update('column', event.newSelection.column,
              elementRegistry.getGraphics(event.newSelection.column));
    }
  });

  eventBus.on('cell.added', function(event) {
    if(rules.allowed('cell.edit', {
      row: event.element.row,
      column: event.element.column,
      content: event.element.content
    }) && !event.element.row.isFoot) {
      event.gfx.setAttribute('contenteditable', true);
    }
  });

  if(keyboard) {
    // to react to keyboard events, commit work when stack actions will occur
    // HACK: Our handler needs a higher priority than the undo handler
    keyboard._listeners.unshift(function(key, modifiers) {
      if ((modifiers.ctrlKey || modifiers.metaKey) && !modifiers.shiftKey && key === 90) {
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
  'commandStack' ];

module.exports = EditBehavior;
