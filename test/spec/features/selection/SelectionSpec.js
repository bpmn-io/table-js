import { inject, bootstrap } from 'test/TestHelper';

import SelectionModule from 'src/features/selection';


describe('Selection', function() {

  const cell1 = { id: 'cell1' },
        cell2 = { id: 'cell2' };

  beforeEach(bootstrap({
    modules: [ SelectionModule ]
  }));

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
  }));


  it('should select by element', inject(function(selection) {

    // when
    selection.select(cell1);

    // then
    expect(selection.get()).to.eql(cell1);
  }));


  it('should select by element ID', inject(function(selection) {

    // when
    selection.select(cell1.id);

    // then
    expect(selection.get()).to.eql(cell1);
  }));


  it('should deselect', inject(function(selection) {

    // given
    selection.select(cell1);

    // when
    selection.deselect();

    // then
    expect(selection.get()).to.not.exist;
  }));


  it('should get selection', inject(function(selection) {

    // given
    selection.select(cell1);

    // when
    // then
    expect(selection.get()).to.eql(cell1);
  }));

});