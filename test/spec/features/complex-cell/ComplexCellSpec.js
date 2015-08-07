'use strict';

var TestHelper = require('../../../TestHelper');

var domify = require('min-dom/lib/domify');

/* global bootstrapTable, inject */


var complexCellModule = require('../../../../lib/features/complex-cell');


describe('features/complex-cell', function() {

  beforeEach(bootstrapTable({ modules: [ complexCellModule ] }));

  beforeEach(inject(function(sheet, elementRegistry) {

    sheet.addColumn({id: 'col1'});
    sheet.addColumn({id: 'col2'});
    sheet.addRow({id: 'row'});

    var cell = elementRegistry.get('cell_col2_row');

    cell.complex = {
      template: domify('<div>')
    };

  }));


  it('should bootstrap diagram with component', inject(function() {}));

  it('should open template', inject(function(complexCell) {
    var template = domify('<div>');
    complexCell.open({
      template: template,
      position: {
        x: 0,
        y: 0
      }
    });
    expect(template.parentNode.parentNode).to.eql(document.body);
  }));

  it('should close template', inject(function(complexCell) {
    var template = domify('<div>');
    complexCell.open({
      template: template,
      position: {
        x: 0,
        y: 0
      }
    });
    complexCell.close();
    expect(template.parentNode.parentNode).to.not.eql(document.body);
  }));

  it('should set custom class name', inject(function(complexCell) {
    var template = domify('<div>');
    complexCell.open({
      template: template,
      className: 'foo',
      position: {
        x: 0,
        y: 0
      }
    });
    complexCell.close();
    expect(template.parentNode.className).to.equal('foo');
  }));

  it('should open template on click', inject(function(eventBus, elementRegistry) {

    var cell = elementRegistry.get('cell_col2_row');

    eventBus.fire('element.click', {
      element: cell
    });

    expect(cell.complex.template.parentNode.parentNode).to.eql(document.body);

  }));

  it('should open template at the cell', inject(function(eventBus, elementRegistry) {

    var cell = elementRegistry.get('cell_col2_row');

    eventBus.fire('element.click', {
      element: cell
    });

    // calculate the cell offset by traversing the offset chain
    var cellOffset = 0;
    var e = elementRegistry.getGraphics('cell_col2_row');
    while (e)
    {
        cellOffset += e.offsetLeft;
        e = e.offsetParent;
    }

    expect(cell.complex.template.parentNode.offsetLeft).to.eql(cellOffset);

  }));

});

