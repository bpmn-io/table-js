'use strict';

require('../../../TestHelper');

/* global bootstrapTable, inject */


var editingModule = require('../../../../lib/features/editing');
var tableNameModule = require('../../../../lib/features/table-name');

describe('features/editing', function() {

  beforeEach(bootstrapTable({ modules: [ editingModule, tableNameModule ] }));

  beforeEach(inject(function(sheet) {

    sheet.addColumn({ id: 'col1' });
    sheet.addColumn({ id: 'col2' });
    sheet.addRow({ id: 'row1' });
    sheet.addRow({ id: 'row2' });
    sheet.setCellContent({ row: 'row1', column: 'col1', content:'test' });
    sheet.setCellContent({ row: 'row1', column: 'col2', content:'test2' });
    sheet.setCellContent({ row: 'row2', column: 'col1', content:'test3' });
    sheet.setCellContent({ row: 'row2', column: 'col2', content:'test4' });

  }));


  describe('bootstrap', function() {

    it('should bootstrap diagram with component', inject(function() {}));

  });


  describe('selecting', function() {
    it('should set selected attribute to true on selection', inject(function(selection, elementRegistry) {
      var element = elementRegistry.get('cell_col1_row1');
      selection.select(element);

      expect(element.selected).to.be.true;
    }));

    it('should set selected attribute to false on deselection', inject(function(selection, elementRegistry) {
      var element = elementRegistry.get('cell_col1_row1');

      selection.select(element);
      selection.deselect();

      expect(element.selected).to.be.false;
    }));

    it('should set selected attribute on row', inject(function(selection, elementRegistry) {
      var element = elementRegistry.get('cell_col1_row1');

      selection.select(element);

      expect(element.row.selected).to.be.true;
    }));

    it('should have only one selected element at a time', inject(function(selection, elementRegistry) {
      var element1 = elementRegistry.get('cell_col1_row1');
      var element2 = elementRegistry.get('cell_col2_row1');

      selection.select(element1);
      selection.select(element2);

      expect(element1.selected).to.be.false;
      expect(element2.selected).to.be.true;
    }));
  });

  describe('selection freeze', function() {
    var element1, element2;
    beforeEach(inject(function(elementRegistry) {
      element1 = elementRegistry.get('cell_col1_row1');
      element2 = elementRegistry.get('cell_col2_row1');
    }));
    it('should not update the selection when selection is frozen', inject(function(selection, elementRegistry) {
      // given
      selection.select(element1);

      // when
      selection.freeze();
      selection.select(element2);

      // then
      expect(selection.get()).to.eql(element1);
    }));
    it('should update the selection when selection is unfrozen', inject(function(selection, elementRegistry) {
      // given
      selection.select(element1);
      selection.freeze();
      selection.select(element2);

      // when
      selection.unfreeze();

      // then
      expect(selection.get()).to.eql(element2);
    }));
    it('should not unset the selection when selection is frozen', inject(function(selection, elementRegistry) {
      // given
      selection.select(element1);

      // when
      selection.freeze();
      selection.deselect();

      // then
      expect(selection.get()).to.eql(element1);
    }));
    it('should unset the selection when selection is unfrozen', inject(function(selection, elementRegistry) {
      // given
      selection.select(element1);
      selection.freeze();
      selection.deselect();

      // when
      selection.unfreeze();

      // then
      expect(selection.get()).to.be.null;
    }));
  });

  describe('select above / below', function() {
    it('should select the cell below', inject(function(selection, elementRegistry) {

      // given
      var cell1 = elementRegistry.get('cell_col1_row1');
      var cell2 = elementRegistry.get('cell_col1_row2');
      selection.select(cell1);

      // when
      selection.selectBelow();

      // then
      expect(cell1.selected).to.be.false;
      expect(cell2.selected).to.be.true;
    }));

    it('should select the cell above', inject(function(selection, elementRegistry) {

      // given
      var cell1 = elementRegistry.get('cell_col1_row1');
      var cell2 = elementRegistry.get('cell_col1_row2');
      selection.select(cell2);

      // when
      selection.selectAbove();

      // then
      expect(cell1.selected).to.be.true;
      expect(cell2.selected).to.be.false;
    }));

    it('should keep the cell selected if there is none below', inject(function(selection, elementRegistry) {

      // given
      var cell2 = elementRegistry.get('cell_col1_row2');
      selection.select(cell2);

      // when
      selection.selectBelow();

      // then
      expect(cell2.selected).to.be.true;
    }));

    it('should keep the cell selected if there is none above', inject(function(selection, elementRegistry) {

      // given
      var cell1 = elementRegistry.get('cell_col1_row1');
      selection.select(cell1);

      // when
      selection.selectAbove();

      // then
      expect(cell1.selected).to.be.true;
    }));

  });

});
