import Inferno from 'inferno';

import { classes as domClasses, query as domQuery } from 'min-dom';

import { inject, bootstrap } from 'test/TestHelper';

import SelectionModule from 'lib/features/selection';

import TestContainer from 'mocha-test-container-support';


describe('Selection', function() {

  const cell1 = { id: 'cell1' },
        cell2 = { id: 'cell2' };

  let nodeCell1,
      nodeCell2;

  let testContainer;

  beforeEach(bootstrap({
    modules: [ SelectionModule ]
  }));

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  beforeEach(inject(function(components, elementRegistry, eventBus, sheet) {
    elementRegistry.add(cell1);
    elementRegistry.add(cell2);

    components.onGetComponent('table.body', () => () => {
      return (
        <tbody>
          <tr>
            <td data-element-id="cell1"></td>
            <td data-element-id="cell2"></td>
          </tr>
        </tbody>
      );
    });

    eventBus.fire('elements.changed', { elements: [ sheet.getRoot() ] });

    const cells = domQuery.all('td', testContainer);

    nodeCell1 = cells[0];
    nodeCell2 = cells[1];
  }));


  it('should select by element', inject(function(selection) {

    // when
    selection.select(cell1);

    // then
    expect(selection._selection).to.eql(cell1);
    expect(domClasses(nodeCell1).array()).to.contain('selected');
  }));


  it('should select by element ID', inject(function(selection) {

    // when
    selection.select(cell1.id);

    // then
    expect(selection._selection).to.eql(cell1);
    expect(domClasses(nodeCell1).array()).to.contain('selected');
  }));


  it('should deselect', inject(function(selection) {

    // given
    selection.select(cell1);

    // when
    selection.deselect();

    // then
    expect(selection._selection).to.not.exist;
    expect(domClasses(nodeCell1).array()).to.not.contain('selected');
  }));


  it('should get selection', inject(function(selection) {

    // given
    selection.select(cell1);

    // when
    // then
    expect(selection.get()).to.eql(cell1);
  }));


  it('should freeze selection', inject(function(selection) {

    // given
    selection.select(cell1);

    // when
    selection.freeze();

    selection.select(cell2);

    // then
    expect(selection._selection).to.eql(cell1);
    expect(domClasses(nodeCell1).array()).to.contain('selected');
    expect(domClasses(nodeCell2).array()).to.not.contain('selected');
  }));


  it('should unfreeze selection', inject(function(selection) {

    // given
    selection.select(cell1);

    selection.freeze();

    // when
    selection.unfreeze();

    selection.select(cell2);

    // then
    expect(selection._selection).to.eql(cell2);
    expect(domClasses(nodeCell1).array()).to.not.contain('selected');
    expect(domClasses(nodeCell2).array()).to.contain('selected');
  }));

});