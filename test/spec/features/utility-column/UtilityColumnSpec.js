'use strict';

var TestHelper = require('../../../TestHelper');

/* global bootstrapTable, inject */


var utilityColumnModule = require('../../../../lib/features/utility-column'),
    tableNameModule = require('../../../../lib/features/table-name'),
    modelingModule = require('../../../../lib/features/modeling');


describe('features/utility-column', function() {

  beforeEach(bootstrapTable({ modules: [ modelingModule, tableNameModule, utilityColumnModule ] }));

  beforeEach(inject(function(sheet) {

    sheet.addColumn({id: 'col1'});
    sheet.addColumn({id: 'col2'});
    sheet.addRow({id: 'row1'});

  }));


  describe('bootstrap', function() {

    it('should bootstrap diagram with component', inject(function() {}));

  });


  describe('interface', function() {

    it('should add a column to the left of the table', inject(function(elementRegistry) {
      var element = elementRegistry.get('cell_utilityColumn_row1');

      expect(element).to.be.defined;
    }));

    it('should return the column', inject(function(utilityColumn) {
      expect(utilityColumn.getColumn()).to.be.defined;
    }));



  });

});
