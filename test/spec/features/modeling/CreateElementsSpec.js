'use strict';

var TestHelper = require('../../../TestHelper');

/* global bootstrapTable, inject */

var modelingModule = require('../../../../lib/features/modeling');


describe('features/modeling - create Row', function() {


  beforeEach(bootstrapTable({ modules: [ modelingModule ] }));

  beforeEach(inject(function(sheet) {
    sheet.addColumn({id: 'col'});
  }));


  describe('basic handling', function() {

    var newRow;

    beforeEach(inject(function(modeling) {

      // add new shape
      newRow = modeling.createRow({ id: 'row' });
    }));


    it('should return row', inject(function() {

      // when
      // shape added

      // then
      expect(newRow).to.be.defined;
    }));


    it('should render row', inject(function(elementRegistry) {

      // when
      // shape added

      // then
      expect(elementRegistry.getGraphics(newRow)).to.be.defined;
    }));


    it('should undo', inject(function(commandStack, elementRegistry) {

      // given
      // shape added

      // when
      commandStack.undo();

      // then
      expect(newRow.parent).to.be.null;
      expect(elementRegistry.getGraphics(newRow)).not.to.be.defined;
    }));

  });


  describe('customization', function() {

    it('should pass custom attributes', inject(function(modeling) {

      // when
      var newRow = modeling.createRow({ id: 'row', custom: true });

      // then
      expect(newRow.custom).to.be.true;
    }));
  });


});


describe('features/modeling - create Column', function() {


  beforeEach(bootstrapTable({ modules: [ modelingModule ] }));

  beforeEach(inject(function(sheet) {
    sheet.addRow({id: 'row'});
  }));


  describe('basic handling', function() {

    var newColumn;

    beforeEach(inject(function(modeling) {

      // add new shape
      newColumn = modeling.createColumn({ id: 'column' });
    }));


    it('should return column', inject(function() {

      // when
      // shape added

      // then
      expect(newColumn).to.be.defined;
    }));


    it('should render column', inject(function(elementRegistry) {

      // when
      // shape added

      // then
      expect(elementRegistry.getGraphics(newColumn)).to.be.defined;
    }));


    it('should undo', inject(function(commandStack, elementRegistry) {

      // given
      // shape added

      // when
      commandStack.undo();

      // then
      expect(newColumn.parent).to.be.null;
      expect(elementRegistry.getGraphics(newColumn)).not.to.be.defined;
    }));

  });


  describe('customization', function() {

    it('should pass custom attributes', inject(function(modeling) {

      // when
      var newColumn = modeling.createRow({ id: 'column', custom: true });

      // then
      expect(newColumn.custom).to.be.true;
    }));
  });


});
