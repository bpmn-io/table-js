import { inject, bootstrap } from 'test/TestHelper';

import ModelingModule from 'src/features/modeling';


describe('modeling - MoveRow', function() {

  beforeEach(bootstrap({
    modules: [ ModelingModule ]
  }));


  let row1,
      row2,
      row3;

  beforeEach(inject(function(modeling) {

    modeling.addCol({ id: 'col1', cells: [] });
    modeling.addCol({ id: 'col2', cells: [] });

    row1 = modeling.addRow({ id: 'row1', cells: [ {}, {} ] });
    row2 = modeling.addRow({ id: 'row2', cells: [ {}, {} ] });
    row3 = modeling.addRow({ id: 'row3', cells: [ {}, {} ] });

  }));


  it('should execute', inject(function(modeling, sheet) {

    // given
    const root = sheet.getRoot();

    // when
    modeling.moveRow(row3, 1);

    // then
    expect(root.rows).to.eql([ row1, row3, row2 ]);
  }));


  it('should revert', inject(function(commandStack, modeling, sheet) {

    // given
    modeling.moveRow(row3, 1);

    const root = sheet.getRoot();

    // when
    commandStack.undo();

    // then
    expect(root.rows).to.eql([ row1, row2, row3 ]);
  }));


  it('should redo', inject(function(commandStack, modeling, sheet) {

    // given
    modeling.moveRow(row3, 1);

    const root = sheet.getRoot();

    // when
    commandStack.undo();
    commandStack.redo();

    // then
    expect(root.rows).to.eql([ row1, row3, row2 ]);
  }));

});