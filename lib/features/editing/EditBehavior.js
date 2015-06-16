'use strict';


function EditBehavior(eventBus, selection, sheet, elementRegistry, modeling) {

  eventBus.on('element.click', function(event) {

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
      var gfxNew = elementRegistry.getGraphics(event.newSelection);

      // allow editing
      gfxNew.setAttribute('contenteditable', true);
      gfxNew.focus();
    }
  });
}

EditBehavior.$inject = [ 'eventBus', 'selection', 'sheet', 'elementRegistry', 'modeling' ];

module.exports = EditBehavior;
