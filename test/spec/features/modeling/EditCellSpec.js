'use strict';

require('../../../TestHelper');

/* global bootstrapTable, inject */

var modelingModule = require('../../../../lib/features/modeling');
var tableNameModule = require('../../../../lib/features/table-name');

describe('features/modeling - edit cell', function() {


  before(bootstrapTable({ modules: [ modelingModule, tableNameModule ] }));

  before(inject(function(sheet) {
    sheet.addColumn({ id: 'col' });
    sheet.addColumn({ id: 'col2' });
    sheet.addRow({ id: 'row' });
    sheet.setCellContent({ row: 'row', column: 'col', content: 'asdf' });
  }));


  describe('basic handling', function() {

    it('should render updated view', inject(function(modeling, elementRegistry) {

      // when
      modeling.editCell('row', 'col', 'foobar');

      // then
      expect(elementRegistry.getGraphics('cell_col_row').textContent).to.eql('foobar');
    }));


    it('should undo', inject(function(commandStack, elementRegistry) {

      // when
      commandStack.undo();

      // then
      expect(elementRegistry.getGraphics('cell_col_row').textContent).to.eql('asdf');
    }));

    it('should redo', inject(function(commandStack, elementRegistry) {

      // when
      commandStack.redo();

      // then
      expect(elementRegistry.getGraphics('cell_col_row').textContent).to.eql('foobar');
    }));

  });

});
