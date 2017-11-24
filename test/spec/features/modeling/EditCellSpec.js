/* global sinon */

import { inject, bootstrap } from 'test/TestHelper';

import ModelingModule from 'lib/features/modeling';


describe('modeling - EditCell', function() {

  beforeEach(bootstrap({
    modules: [ ModelingModule ]
  }));


  let row, cell;

  beforeEach(inject(function(modeling) {

    // given
    modeling.addCol({ id: 'col1' });
    row = modeling.addRow({ id: 'row1' });

    cell = row.cells[0];
  }));


  it('should execute', inject(function(eventBus, modeling) {

    // given
    const spy = sinon.spy(function(e) {
      expect(e.elements).to.contain(cell);
    });

    eventBus.once('elements.changed', spy);

    // when
    modeling.editCell(cell, { foo: 'bar' });

    // then
    expect(spy).to.have.been.called;
  }));


  it('should revert', inject(function(commandStack, eventBus, modeling) {

    // given
    const spy = sinon.spy(function(e) {
      expect(e.elements).to.contain(cell);
    });

    // when
    modeling.editCell(cell, { foo: 'bar' });

    eventBus.once('elements.changed', spy);

    commandStack.undo();

    // when
    // then
    expect(spy).to.have.been.called;
  }));


  it('should provide extension point for external change handlers');

});