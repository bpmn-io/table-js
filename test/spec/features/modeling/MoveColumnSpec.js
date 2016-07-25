'use strict';

require('../../../TestHelper');

var forEach = require('lodash/collection/forEach');
/* global bootstrapTable, inject */

var modelingModule = require('../../../../lib/features/modeling');
var tableNameModule = require('../../../../lib/features/table-name');

describe('features/modeling - move column', function() {

  before(bootstrapTable({ modules: [ modelingModule, tableNameModule ] }));

  var columns;
  before(inject(function(sheet) {
    columns = [
      { id: '1' },
      { id: '2' },
      { id: '3' }
    ];
    forEach(columns, function(column) {
      sheet.addColumn(column);
    });
  }));


  describe('basic handling', function() {

    it('should apply the change', inject(function(modeling, elementRegistry) {
      // when
      modeling.moveColumn(columns[0], columns[1], false);
      // then
      expect(columns[0].next).to.eql(columns[2]);
    }));

    it('should undo', inject(function(commandStack, elementRegistry) {
      // when
      commandStack.undo();
      // then
      expect(columns[0].next).to.eql(columns[1]);
    }));

    it('should redo', inject(function(commandStack, elementRegistry) {
      // when
      commandStack.redo();
      // then
      expect(columns[0].next).to.eql(columns[2]);
    }));

  });

});
