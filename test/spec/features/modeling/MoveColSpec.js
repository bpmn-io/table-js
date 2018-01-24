import { inject, bootstrap } from 'test/TestHelper';

import ModelingModule from 'lib/features/modeling';


describe('modeling - MoveCol', function() {

  beforeEach(bootstrap({
    modules: [ ModelingModule ]
  }));


  let col1,
      col2,
      col3;

  beforeEach(inject(function(modeling) {

    col1 = modeling.addCol({ id: 'col1', cells: [] });
    col2 = modeling.addCol({ id: 'col2', cells: [] });
    col3 = modeling.addCol({ id: 'col2', cells: [] });

    modeling.addRow({ id: 'row1', cells: [ {}, {}, {} ] });
    modeling.addRow({ id: 'row2', cells: [ {}, {}, {} ] });

  }));


  it('should execute', inject(function(modeling, sheet) {

    // given
    const root = sheet.getRoot();

    // when
    modeling.moveCol(col3, 1);

    // then
    expect(root.cols).to.eql([ col1, col3, col2 ]);
  }));


  it('should revert', inject(function(commandStack, modeling, sheet) {

    // given
    modeling.moveCol(col3, 1);

    const root = sheet.getRoot();

    // when
    commandStack.undo();

    // then
    expect(root.cols).to.eql([ col1, col2, col3 ]);
  }));


  it('should redo', inject(function(commandStack, modeling, sheet) {

    // given
    modeling.moveCol(col3, 1);

    const root = sheet.getRoot();

    // when
    commandStack.undo();
    commandStack.redo();

    // then
    expect(root.cols).to.eql([ col1, col3, col2 ]);
  }));

});