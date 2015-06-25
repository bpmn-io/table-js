'use strict';

var TestHelper = require('../../../TestHelper');

/* global bootstrapTable, inject */


var lineNumbersModule = require('../../../../lib/features/line-numbers');


describe('features/utility-column', function() {

  beforeEach(bootstrapTable({ modules: [ lineNumbersModule ] }));

  beforeEach(inject(function(sheet) {

    sheet.addColumn({id: 'col1'});
    sheet.addRow({id: 'row1'});
    sheet.addRow({id: 'row2'});

  }));


  describe('bootstrap', function() {

    it('should bootstrap diagram with component', inject(function() {}));

    it('should display line numbers', inject(function(elementRegistry) {
      var ln1 = elementRegistry.get('cell_utilityColumn_row1');
      var ln2 = elementRegistry.get('cell_utilityColumn_row2');

      expect(ln1.content).to.eql(1);
      expect(ln2.content).to.eql(2);
    }));

  });


  describe('update', function() {
    it('should display line number for newly added row', inject(function(sheet, elementRegistry) {
      sheet.addRow({id:'row3'});

      var ln = elementRegistry.get('cell_utilityColumn_row3');

      expect(ln.content).to.eql(3);
    }));

    it('should update line number when adding row in the middle', inject(function(sheet, elementRegistry) {
      sheet.addRow({id:'row3', previous: elementRegistry.get('row1')});

      expect(elementRegistry.get('cell_utilityColumn_row1').content).to.eql(1);
      expect(elementRegistry.get('cell_utilityColumn_row3').content).to.eql(2);
      expect(elementRegistry.get('cell_utilityColumn_row2').content).to.eql(3);
    }));

    it('should update line number when removing row', inject(function(sheet, elementRegistry) {
      sheet.removeRow(elementRegistry.get('row1'));

      expect(elementRegistry.get('cell_utilityColumn_row2').content).to.eql(1);
    }));

  });

});

