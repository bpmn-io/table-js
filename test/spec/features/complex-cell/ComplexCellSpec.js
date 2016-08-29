'use strict';

require('../../../TestHelper');

var domify = require('min-dom/lib/domify');

/* global bootstrapTable, inject */


var complexCellModule = require('../../../../lib/features/complex-cell');
var popupModule = require('../../../../lib/features/popup-menu');


describe('features/complex-cell', function() {

  beforeEach(bootstrapTable({ modules: [ complexCellModule, popupModule ] }));

  beforeEach(inject(function(sheet, elementRegistry) {

    sheet.addColumn({ id: 'col1' });
    sheet.addColumn({ id: 'col2' });
    sheet.addRow({ id: 'row' });

    var cell = elementRegistry.get('cell_col2_row');

    cell.complex = {
      template: domify('<div>')
    };

  }));


  it('should bootstrap diagram with component', inject(function() {}));


  it('should open template', inject(function(complexCell, sheet) {
    // given
    var template = domify('<div>'),
        parent = sheet.getContainer();

    // when
    complexCell.open({
      template: template,
      position: {
        x: 0,
        y: 0
      }
    });

    // then
    expect(template.parentNode.parentNode).to.eql(parent);
  }));


  it('should close template', inject(function(complexCell, sheet) {
    // given
    var template = domify('<div>'),
        parent = sheet.getContainer();

    // when
    complexCell.open({
      template: template,
      position: {
        x: 0,
        y: 0
      }
    });

    complexCell.close();

    // then
    expect(template.parentNode.parentNode).to.not.eql(parent);
  }));


  it('should set custom class name', inject(function(complexCell) {
    // given
    var template = domify('<div>');

    // when
    complexCell.open({
      template: template,
      className: 'foo',
      position: {
        x: 0,
        y: 0
      }
    });

    complexCell.close();

    // then
    expect(template.parentNode.className).to.equal('foo');
  }));


  it('should open template on click', inject(function(eventBus, elementRegistry, sheet) {
    // given
    var cell = elementRegistry.get('cell_col2_row'),
        parent = sheet.getContainer();

    // when
    eventBus.fire('element.click', {
      element: cell
    });

    // then
    expect(cell.complex.template.parentNode.parentNode).to.eql(parent);
  }));


  it('should open template at the cell', inject(function(eventBus, elementRegistry) {
    // given
    var cell = elementRegistry.get('cell_col2_row'),
        cellOffset = 0,
        e;

    // when
    eventBus.fire('element.click', {
      element: cell
    });

    // calculate the cell offset by traversing the offset chain
    e = elementRegistry.getGraphics('cell_col2_row');

    cellOffset = e.offsetLeft;

    // then
    expect(cell.complex.template.parentNode.offsetLeft).to.eql(cellOffset);
  }));


  it('should close when opening a popup menu', inject(function(complexCell, popupMenu) {
    // given
    var template = domify('<div>');

    // when
    complexCell.open({
      template: template,
      position: {
        x: 0,
        y: 0
      }
    });

    // then
    expect(complexCell.isOpen()).to.be.true;

    // when
    popupMenu.open({ position: { x:0, y:0 }, entries: [] });

    // then
    expect(complexCell.isOpen()).to.be.false;
  }));

});
