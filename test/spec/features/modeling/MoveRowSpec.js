'use strict';

require('../../../TestHelper');

var forEach = require('lodash/collection/forEach');
/* global bootstrapTable, inject */

var modelingModule = require('../../../../lib/features/modeling');
var tableNameModule = require('../../../../lib/features/table-name');

describe('features/modeling - move row', function() {

  before(bootstrapTable({ modules: [ modelingModule, tableNameModule ] }));

  var rows;
  before(inject(function(sheet) {
    rows = [
      { id: '1' },
      { id: '2' },
      { id: '3' }
    ];
    forEach(rows, function(row) {
      sheet.addRow(row);
    });
  }));


  describe('basic handling', function() {

    it('should apply the change', inject(function(modeling, elementRegistry) {
      // when
      modeling.moveRow(rows[0], rows[1], false);
      // then
      expect(rows[0].next).to.eql(rows[2]);
    }));

    it('should undo', inject(function(commandStack, elementRegistry) {
      // when
      commandStack.undo();
      // then
      expect(rows[0].next).to.eql(rows[1]);
    }));

    it('should redo', inject(function(commandStack, elementRegistry) {
      // when
      commandStack.redo();
      // then
      expect(rows[0].next).to.eql(rows[2]);
    }));

  });

});
