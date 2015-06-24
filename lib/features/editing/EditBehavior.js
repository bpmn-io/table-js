'use strict';


function EditBehavior(eventBus, selection, sheet, elementRegistry, modeling, rules, graphicsFactory) {

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
    }
    if(event.newSelection) {
      graphicsFactory.update('cell', event.newSelection, elementRegistry.getGraphics(event.newSelection));
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
}

EditBehavior.$inject = [ 'eventBus', 'selection', 'sheet', 'elementRegistry', 'modeling', 'rules', 'graphicsFactory' ];

module.exports = EditBehavior;
