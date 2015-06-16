'use strict';

var TestHelper = require('../../../TestHelper');

/* global bootstrapTable, inject */


var interactionEventsModule = require('../../../../lib/features/interaction-events');


describe('features/interaction-events', function() {

  beforeEach(bootstrapTable({ modules: [ interactionEventsModule ] }));

  beforeEach(inject(function(sheet) {

    sheet.addColumn({id: 'col1'});
    sheet.addColumn({id: 'col2'});
    sheet.addRow({id: 'row1'});
    sheet.setCellContent({row: 'row1', column: 'col1', content:'test'});

  }));


  describe('bootstrap', function() {

    it('should bootstrap diagram with component', inject(function() {}));

  });


  describe('event emitting', function() {

    it('should emit element.(click|hover|out|dblclick) events', inject(function(eventBus) {

      [ 'hover', 'out', 'click', 'dblclick' ].forEach(function(type) {

        //TODO: Test the events
        eventBus.on('element.' + type, function(event) {
          console.log(type, event);
        });
      });

    }));

  });

});
