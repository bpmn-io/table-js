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
    it('should set selected attribute to true on selection', inject(function(selection, elementRegistry){
      var element = elementRegistry.get('cell_col1_row1');
      selection.select(element);

      expect(element.selected).to.be.true;
    }));

    it('should set selected attribute to false on deselection', inject(function(selection, elementRegistry){
      var element = elementRegistry.get('cell_col1_row1');

      selection.select(element);
      selection.deselect();

      expect(element.selected).to.be.false;
    }));

    it('should set selected attribute on row', inject(function(selection, elementRegistry){
      var element = elementRegistry.get('cell_col1_row1');

      selection.select(element);

      expect(element.row.selected).to.be.true;
    }));

    it('should have only one selected element at a time', inject(function(selection, elementRegistry){
      var element1 = elementRegistry.get('cell_col1_row1');
      var element2 = elementRegistry.get('cell_col2_row1');

      selection.select(element1);
      selection.select(element2);

      expect(element1.selected).to.be.false;
      expect(element2.selected).to.be.true;
    }));
  });

});
