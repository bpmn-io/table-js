import { inject, bootstrap } from 'test/TestHelper';

import ModelingModule from 'lib/modeling';


describe('modeling - RemoveCol', function() {

  beforeEach(bootstrap({
    modules: [ ModelingModule ]
  }));


  let row1,
      row2,
      col1,
      col2,
      col3;

  beforeEach(inject(function(sheet) {
    
    col1 = sheet.addCol({ id: 'col1', cells: [] });
    col2 = sheet.addCol({ id: 'col2', cells: [] });
    col3 = sheet.addCol({ id: 'col3', cells: [] });

    row1 = sheet.addRow({ id: 'row1', cells: [ {}, {}, {} ] });
    row2 = sheet.addRow({ id: 'row2', cells: [ {}, {}, {} ] });

  }));


  it('should execute', inject(function(modeling, sheet) {

    // given
    const root = sheet.getRoot();

    let expectedCells = removeAtIndex(row1.cells, 1);

    // when
    modeling.removeCol(col2);

    // then

    // column got removed
    expect(root.cols).to.eql([ col1, col3 ]);

    // column got properly unmounted
    expect(col2.root).not.to.exist;

    // column cell got removed
    expect(row1.cells).to.eql(expectedCells);

  }));


  it('should revert', inject(function(modeling, commandStack, sheet) {

    // given
    const root = sheet.getRoot();
    const expectedCells = row2.cells.slice();

    // when
    modeling.removeCol(col2);
    
    commandStack.undo();

    // then
    // column is back
    expect(root.cols).to.eql([ col1, col2, col3 ]);

    // column is properly mounted
    expect(col2.root).to.eql(root);

    // column cells are back
    expect(row2.cells).to.eql(expectedCells);

  }));


  it('should redo', inject(function(modeling, commandStack, sheet) {

    // given
    const root = sheet.getRoot();

    let expectedCells = removeAtIndex(row1.cells, 1);

    // when
    modeling.removeCol(col2);

    commandStack.undo();
    commandStack.redo();

    // then

    // column got removed
    expect(root.cols).to.eql([ col1, col3 ]);

    // column got properly unmounted
    expect(col2.root).not.to.exist;

    // column cell got removed
    expect(row1.cells).to.eql(expectedCells);

  }));

});



////////// helpers //////////

function removeAtIndex(array, idx) {

  const copy = array.slice();

  copy.splice(idx, 1);

  return copy;
}
