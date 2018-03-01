/* global sinon */

import { inject, bootstrap } from 'test/TestHelper';


describe('Sheet', function() {

  beforeEach(bootstrap());


  describe('root', function() {

    it('set root', inject(function(sheet) {

      // given
      const root = { id: 'foo' };

      // when
      sheet.setRoot(root);

      // then
      expect(sheet._root).to.eql(root);
    }));


    it('setting root should fire events', inject(function(eventBus, sheet) {

      // given
      const oldRoot = { id: 'foo' };
      const newRoot = { id: 'bar' };

      sheet._root = oldRoot;

      const removeSpy = sinon.spy(function(e) {
        expect(e.root).to.eql(oldRoot);
      });

      const removedSpy = sinon.spy(function(e) {
        expect(e.root).to.eql(oldRoot);
      });

      const addSpy = sinon.spy(function(e) {
        expect(e.root).to.eql(newRoot);
      });

      const addedSpy = sinon.spy(function(e) {
        expect(e.root).to.eql(newRoot);
      });

      eventBus.on('root.remove', removeSpy);
      eventBus.on('root.removed', removedSpy);
      eventBus.on('root.add', addSpy);
      eventBus.on('root.added', addedSpy);

      // when
      sheet.setRoot(newRoot);
    }));


    it('get root should return set root', inject(function(sheet) {

      // given
      const root = { id: 'foo' };

      sheet._root = root;

      // when
      // then
      expect(sheet.getRoot()).to.eql(root);
    }));


    it('get root should return implicit root', inject(function(sheet) {

      // when
      // then
      expect(sheet.getRoot()).to.eql({
        id: '__implicitroot',
        rows: [],
        cols: []
      });
    }));


    it('should remove root on table.clear', inject(function(eventBus, sheet) {

      // given
      const root = { id: 'foo' };

      sheet._root = root;

      // when
      eventBus.fire('table.clear');

      // then
      expect(sheet._root).to.be.null;
    }));

  });


  describe('addRow', function() {

    it('add row', inject(function(elementRegistry, sheet) {

      // given
      const row = { id: 'row', cells: [] };

      // when
      sheet.addRow(row);

      // then
      expect(elementRegistry.get('row')).to.exist;
      expect(elementRegistry.getAll()).to.have.lengthOf(1);
    }));


    it('should fire row.add', inject(function(elementRegistry, eventBus, sheet) {

      // given
      const row = { id: 'row', cells: [] };

      const spy = sinon.spy(function(e) {
        expect(e.row).to.eql(row);
      });

      eventBus.on('row.add', spy);

      // when
      sheet.addRow(row);
    }));


    it('add row with cells', inject(function(elementRegistry, sheet) {

      // given
      sheet.addCol({ id: 'col', cells: [] });

      const row = {
        id: 'row',
        cells: [{
          id: 'cell'
        }]
      };

      // when
      sheet.addRow(row);

      // then
      expect(elementRegistry.getAll('row')).to.exist;
      expect(elementRegistry.getAll('cell')).to.exist;
      expect(elementRegistry.getAll()).to.have.lengthOf(3);
    }));


    it('add row at index', inject(function(elementRegistry, sheet) {

      // given
      sheet.addCol({ id: 'col', cells: [] });

      const row1 = {
        id: 'row1',
        cells: [{
          id: 'cell1'
        }]
      };

      const row2 = {
        id: 'row2',
        cells: [{
          id: 'cell2'
        }]
      };

      sheet.addRow(row1);

      // when
      sheet.addRow(row2, 0);

      // then
      expect(sheet.getRoot().rows).to.eql([
        row2,
        row1
      ]);
    }));

  });


  describe('removeRow', function() {

    it('remove row with given row', inject(function(elementRegistry, sheet) {

      // given
      const row = { id: 'row', cells: [] };

      sheet.addRow(row);

      // when
      sheet.removeRow(row);

      // then
      expect(elementRegistry.get('row')).to.not.exist;
      expect(elementRegistry.getAll()).to.have.lengthOf(0);
    }));


    it('remove row with given row id', inject(function(elementRegistry, sheet) {

      // given
      const row = { id: 'row', cells: [] };

      sheet.addRow(row);

      // when
      sheet.removeRow(row.id);

      // then
      expect(elementRegistry.get('row')).to.not.exist;
      expect(elementRegistry.getAll()).to.have.lengthOf(0);
    }));



    it('should fire row.remove', inject(function(elementRegistry, eventBus, sheet) {

      // given
      const row = { id: 'row', cells: [] };

      const spy = sinon.spy(function(e) {
        expect(e.row).to.eql(row);
      });

      sheet.addRow(row);

      eventBus.on('row.remove', spy);

      // when
      sheet.removeRow(row);
    }));

  });


  describe('addCol', function() {

    it('add col', inject(function(elementRegistry, sheet) {

      // given
      const col = { id: 'col', cells: [] };

      // when
      sheet.addCol(col);

      // then
      expect(elementRegistry.get('col')).to.exist;
      expect(elementRegistry.getAll()).to.have.lengthOf(1);
    }));


    it('should fire col.add', inject(function(elementRegistry, eventBus, sheet) {

      // given
      const col = { id: 'col', cells: [] };

      const spy = sinon.spy(function(e) {
        expect(e.col).to.eql(col);
      });

      eventBus.on('col.add', spy);

      // when
      sheet.addCol(col);
    }));


    it('add col with cells', inject(function(elementRegistry, sheet) {

      // given
      sheet.addRow({ id: 'row', cells: [] });

      const col = {
        id: 'col',
        cells: [{
          id: 'cell'
        }]
      };

      // when
      sheet.addCol(col);

      // then
      expect(elementRegistry.getAll('col')).to.exist;
      expect(elementRegistry.getAll('cell')).to.exist;
      expect(elementRegistry.getAll()).to.have.lengthOf(3);
    }));


    it('add col at index', inject(function(elementRegistry, sheet) {

      // given
      sheet.addRow({ id: 'row', cells: [] });

      const col1 = {
        id: 'col1',
        cells: [{
          id: 'cell1'
        }]
      };

      const col2 = {
        id: 'col2',
        cells: [{
          id: 'cell2'
        }]
      };

      sheet.addCol(col1);

      // when
      sheet.addCol(col2, 0);

      // then
      expect(sheet.getRoot().cols).to.eql([
        col2,
        col1
      ]);
    }));

  });


  describe('removeCol', function() {

    it('remove col with given col', inject(function(elementRegistry, sheet) {

      // given
      const col = { id: 'col', cells: [] };

      sheet.addCol(col);

      // when
      sheet.removeCol(col);

      // then
      expect(elementRegistry.get('col')).to.not.exist;
      expect(elementRegistry.getAll()).to.have.lengthOf(0);
    }));


    it('remove col with given col id', inject(function(elementRegistry, sheet) {

      // given
      const col = { id: 'col', cells: [] };

      sheet.addCol(col);

      // when
      sheet.removeCol(col.id);

      // then
      expect(elementRegistry.get('col')).to.not.exist;
      expect(elementRegistry.getAll()).to.have.lengthOf(0);
    }));



    it('should fire col.remove', inject(function(elementRegistry, eventBus, sheet) {

      // given
      const col = { id: 'col', cells: [] };

      const spy = sinon.spy(function(e) {
        expect(e.col).to.eql(col);
      });

      sheet.addCol(col);

      eventBus.on('col.remove', spy);

      // when
      sheet.removeCol(col);
    }));

  });


  describe('resized', function() {

    it('should emit <sheet.resized> event', inject(function(eventBus, sheet) {

      let listenerCalled = false;

      // given
      eventBus.on('sheet.resized', function() {
        listenerCalled = true;
      });

      // when
      sheet.resized();

      // then
      expect(listenerCalled).to.be.true;
    }));

  });

});