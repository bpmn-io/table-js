import { inject, bootstrap } from 'test/TestHelper';

import ModelingModule from 'lib/features/modeling';


describe('modeling - AddCol', function() {

  beforeEach(bootstrap({
    modules: [ ModelingModule ]
  }));


  it('should execute', inject(function(elementRegistry, modeling, sheet) {

    // when
    const col = modeling.addCol({ id: 'col' });

    // then
    const root = sheet.getRoot();

    expect(root.cols).to.eql([ col ]);
    expect(col.root).to.eql(root);

    expect(elementRegistry.get('col')).to.eql(col);
  }));


  it('should revert', inject(function(commandStack, elementRegistry, modeling, sheet) {

    // given
    const col = modeling.addCol({ id: 'col' });
    const root = sheet.getRoot();

    // when
    commandStack.undo();

    // then
    expect(root.cols).to.be.empty;
    expect(col.root).not.to.exist;

    expect(elementRegistry.get('col')).not.to.exist;
  }));


  it('should redo', inject(function(commandStack, elementRegistry, modeling, sheet) {

    // given
    const col = modeling.addCol({ id: 'col' });

    // when
    commandStack.undo();
    commandStack.redo();

    // then
    const root = sheet.getRoot();

    expect(root.cols).to.eql([ col ]);
    expect(col.root).to.eql(root);

    expect(elementRegistry.get('col')).to.eql(col);
  }));


  describe('with existing rows', function() {
  
    beforeEach(inject(function(sheet) {
      
      sheet.addCol({ id: 'row1', cells: [] });
      sheet.addCol({ id: 'row2', cells: [] });

    }));


    it('should execute', inject(function(elementRegistry, modeling, sheet) {
      
      // when
      modeling.addCol();
      
      const root = sheet.getRoot();
  
      // then
      root.rows.forEach(row => {
        expect(row.cells).to.have.lengthOf(1);
      });
    }));

    
    it('should revert', inject(function(commandStack, elementRegistry, modeling, sheet) {
      
      // given
      modeling.addCol();
      
      const root = sheet.getRoot();
  
      // when
      commandStack.undo();
  
      // then
      root.rows.forEach(row => {
        expect(row.cells).to.have.lengthOf(0);
      });
    }));


    it('should redo', inject(function(commandStack, elementRegistry, modeling, sheet) {
      
      // given
      modeling.addCol();

      const root = sheet.getRoot();
  
      // when
      commandStack.undo();
      commandStack.redo();

      // then
      root.rows.forEach(row => {
        expect(row.cells).to.have.lengthOf(1);
      });
    }));

  });

});