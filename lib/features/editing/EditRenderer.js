'use strict';

var domClasses = require('min-dom/lib/classes');

function EditRenderer(
    eventBus,
    rules) {

  eventBus.on('cell.render', function(event) {
    if(rules.allowed('cell.edit', {
      row: event.data.row,
      column: event.data.column,
      content: event.data.content
    }) && !event.data.row.isFoot  &&
          !event.data.complex) {
      event.gfx.childNodes[0].setAttribute('contenteditable', true);
    } else {
      event.gfx.childNodes[0].setAttribute('contenteditable', false);
    }

    event.gfx.childNodes[0].setAttribute('spellcheck', 'false');

    if(event.data.selected){
      domClasses(event.gfx).add('focused');
    } else {
      domClasses(event.gfx).remove('focused');
    }

    if(!event.data.row.isFoot) {

      if(event.data.row.selected && !event.data.isHead) {
        domClasses(event.gfx).add('row-focused');
      } else {
        domClasses(event.gfx).remove('row-focused');
      }
      if(event.data.column.selected) {
        domClasses(event.gfx).add('col-focused');
      } else {
        domClasses(event.gfx).remove('col-focused');
      }
    }

  });

  eventBus.on('row.render', function(event) {
    if(event.data.selected && !event.data.isHead) {
      domClasses(event.gfx).add('row-focused');
    } else {
      domClasses(event.gfx).remove('row-focused');
    }

  });
}

EditRenderer.$inject = [
  'eventBus',
  'rules'
];

module.exports = EditRenderer;
