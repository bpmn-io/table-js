'use strict';

var TestHelper = require('../../../TestHelper');

/* global bootstrapTable, inject */

var modelingModule = require('../../../../lib/features/modeling');
var tableNameModule = require('../../../../lib/features/table-name');

describe('features/modeling - delete Row', function() {


  beforeEach(bootstrapTable({ modules: [ modelingModule, tableNameModule ] }));

  beforeEach(inject(function(sheet) {
    sheet.addColumn({id: 'col'});
  }));


  describe('basic handling', function() {

    var newRow;

    beforeEach(inject(function(sheet) {

      // add new shape
      newRow = {id: 'row'};
      sheet.addRow(newRow);
    }));


    it('should remove row graphics', inject(function(modeling, elementRegistry) {

      // when
      // row removed
      modeling.deleteRow(newRow);

      // then
      expect(elementRegistry.getGraphics(newRow)).not.to.be.defined;
    }));

    it('should undo', inject(function(commandStack, elementRegistry) {

      // given
      // shape added

      // when
      commandStack.undo();

      // then
      expect(newRow.parent).not.to.be.null;
      expect(elementRegistry.getGraphics(newRow)).to.be.defined;
    }));

    it('should redo', inject(function(commandStack, elementRegistry) {

      // given
      // shape added

      // when
      commandStack.redo();

      // then
      expect(elementRegistry.getGraphics(newRow)).not.to.be.defined;
    }));

  });

});

describe('features/modeling - delete Column', function() {


  beforeEach(bootstrapTable({ modules: [ modelingModule, tableNameModule ] }));

  beforeEach(inject(function(sheet) {
    sheet.addRow({id: 'row'});
  }));


  describe('basic handling', function() {

    var newColumn;

    beforeEach(inject(function(sheet) {

      // add new shape
      newColumn = {id: 'column'};
      sheet.addColumn(newColumn);
    }));


    it('should remove column graphics', inject(function(modeling, elementRegistry) {

      // when
      // column removed
      modeling.deleteColumn(newColumn);

      // then
      expect(elementRegistry.getGraphics(newColumn)).not.to.be.defined;
    }));

    it('should undo', inject(function(commandStack, elementRegistry) {

      // given
      // shape added

      // when
      commandStack.undo();

      // then
      expect(newColumn.parent).not.to.be.null;
      expect(elementRegistry.getGraphics(newColumn)).to.be.defined;
    }));

    it('should redo', inject(function(commandStack, elementRegistry) {

      // given
      // shape added

      // when
      commandStack.redo();

      // then
      expect(elementRegistry.getGraphics(newColumn)).not.to.be.defined;
    }));

  });

});
