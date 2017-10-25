import { inject, bootstrap } from 'test/TestHelper';

import ModelingModule from 'lib/modeling';


describe('modeling - RemoveRow', function() {

  beforeEach(bootstrap({
    modules: [ ModelingModule ]
  }));


  let row1,
      row2,
      row3,
      col1,
      col2;

  beforeEach(inject(function(sheet) {

    col1 = sheet.addCol({ id: 'col1', cells: [] });
    col2 = sheet.addCol({ id: 'col2', cells: [] });

    row1 = sheet.addRow({ id: 'row1', cells: [ {}, {} ] });
    row2 = sheet.addRow({ id: 'row2', cells: [ {}, {} ] });
    row3 = sheet.addRow({ id: 'row3', cells: [ {}, {} ] });

  }));


  it('should execute', inject(function(modeling, sheet) {

    // given
    const root = sheet.getRoot();

    // when
    modeling.removeRow(row2);

    // then

    // row got removed
    expect(root.rows).to.eql([ row1, row3 ]);

    // row got properly unmounted
    expect(row2.root).not.to.exist;

  }));


  it('should revert', inject(function(modeling, commandStack, sheet) {

    // given
    const root = sheet.getRoot();

    // when
    modeling.removeRow(row2);

    commandStack.undo();

    // then
    // column is back
    expect(root.rows).to.eql([ row1, row2, row3 ]);

    // column is properly mounted
    expect(row2.root).to.eql(root);

  }));


  it('should redo', inject(function(modeling, commandStack, sheet) {

    // given
    const root = sheet.getRoot();

    // when
    modeling.removeRow(row2);

    commandStack.undo();
    commandStack.redo();

    // then

    // row got removed
    expect(root.rows).to.eql([ row1, row3 ]);

    // row got properly unmounted
    expect(row2.root).not.to.exist;

  }));

});