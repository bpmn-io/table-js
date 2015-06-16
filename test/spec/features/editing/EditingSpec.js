'use strict';

var TestHelper = require('../../../TestHelper');

/* global bootstrapTable, inject */


var editingModule = require('../../../../lib/features/editing');


describe('features/editing', function() {

  beforeEach(bootstrapTable({ modules: [ editingModule ] }));

  beforeEach(inject(function(sheet) {

    sheet.addColumn({id: 'col1'});
    sheet.addColumn({id: 'col2'});
    sheet.addRow({id: 'row1'});
    sheet.setCellContent({row: 'row1', column: 'col1', content:'test'});
    sheet.setCellContent({row: 'row1', column: 'col2', content:'test2'});

  }));


  describe('bootstrap', function() {

    it('should bootstrap diagram with component', inject(function() {}));

  });


  describe('selecting', function() {

  });

});
