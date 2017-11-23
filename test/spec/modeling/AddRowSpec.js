import { inject, bootstrap } from 'test/TestHelper';

import ModelingModule from 'lib/features/modeling';


describe('modeling - AddRow', function() {

  beforeEach(bootstrap({
    modules: [ ModelingModule ]
  }));


  it('should execute', inject(function(elementRegistry, modeling, sheet) {

    // when
    const row = modeling.addRow({ id: 'row' });

    // then
    const root = sheet.getRoot();

    expect(root.rows).to.eql([ row ]);
    expect(row.root).to.eql(root);

    expect(elementRegistry.get('row')).to.eql(row);
  }));


  it('should revert', inject(function(commandStack, elementRegistry, modeling, sheet) {

    // given
    const row = modeling.addRow({ id: 'row' });
    const root = sheet.getRoot();

    // when
    commandStack.undo();

    // then
    expect(row.root).not.to.exist;
    expect(root.rows).to.be.empty;

    expect(elementRegistry.get('row')).not.to.exist;
  }));


  it('should redo', inject(function(commandStack, elementRegistry, modeling, sheet) {

    // given
    const row = modeling.addRow({ id: 'row' });

    // when
    commandStack.undo();
    commandStack.redo();

    // then
    const root = sheet.getRoot();

    expect(root.rows).to.eql([ row ]);
    expect(row.root).to.eql(root);

    expect(elementRegistry.get('row')).to.eql(row);
  }));


  describe('with existing cols', function() {

    beforeEach(inject(function(sheet) {
      
      sheet.addCol({ id: 'col1', cells: [] });
      sheet.addCol({ id: 'col2', cells: [] });

    }));


    it('should execute', inject(function(elementRegistry, modeling, sheet) {
      
      // when
      modeling.addRow();

      const root = sheet.getRoot();
  
      // then
      root.cols.forEach(col => {
        expect(col.cells).to.have.lengthOf(1);
      });
    }));

    
    it('should revert', inject(function(commandStack, elementRegistry, modeling, sheet) {
      
      // given
      modeling.addRow();

      const root = sheet.getRoot();
  
      // when
      commandStack.undo();
  
      // then
      root.cols.forEach(col => {
        expect(col.cells).to.have.lengthOf(0);
      });
    }));


    it('should redo', inject(function(commandStack, elementRegistry, modeling, sheet) {
      
      // given
      modeling.addRow();

      const root = sheet.getRoot();
  
      // when
      commandStack.undo();
      commandStack.redo();

      // then
      root.cols.forEach(col => {
        expect(col.cells).to.have.lengthOf(1);
      });
    }));

  });

});