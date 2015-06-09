'use strict';

var TestHelper = require('../../TestHelper');

/* global bootstrapTable, inject, sinon */

var merge = require('lodash/object/merge');
var TestContainer = require('mocha-test-container-support');

describe('Sheet', function() {

  var container;

  /**
   * Create a diagram with the given options
   */
  function createTable(options) {

    return bootstrapTable(function() {
      return merge({ sheet: { container: container } }, options);
    }, {});
  }

  describe('initialize', function() {

    beforeEach(function() {
      container = TestContainer.get(this);
    });
    beforeEach(createTable());

    it('should create <table> element', inject(function() {

      // then
      var table = container.querySelector('table');

      expect(table).not.to.be.null;
    }));

  });


  describe('destroy', function() {

    beforeEach(function() {
      container = TestContainer.get(this);
    });
    beforeEach(createTable());

    it('should remove created elements', inject(function(eventBus) {

      // when
      eventBus.fire('table.destroy');

      // then
      expect(container.childNodes.length).to.equal(0);
    }));

  });

  describe('#addRow', function() {

    beforeEach(function() {
      container = TestContainer.get(this);
    });

    beforeEach(createTable());


    it('should fire <row.add> event', inject(function(sheet, eventBus) {

      // given
      var listener = sinon.spy();
      eventBus.on('row.add', listener);

      // when
      sheet.addRow({ id: 'a' });

      // then
      expect(listener).to.have.been.called;
    }));


    it('should fire <row.added> event', inject(function(sheet, eventBus) {

      // given
      var listener = sinon.spy();
      eventBus.on('row.added', listener);

      // when
      sheet.addRow({ id: 'a' });

      // then
      expect(listener).to.have.been.called;
    }));


    it('should add row to registry', inject(function(sheet, elementRegistry) {

      var row = { id: 'a' };

      // when
      sheet.addRow(row);

      // then
      expect(elementRegistry.get('a')).to.equal(row);
    }));


    it('should fail when shape#id is not set', inject(function(sheet) {

      // given
      var s = {};

      expect(function() {

        // when
        sheet.addRow(s);

        throw new Error('expected exception');
      }).to.throw('element must have an id');
    }));


    it('should fail when adding shape#id twice', inject(function(sheet, elementRegistry) {

      // given
      var s = { id: 'FOO' };

      expect(function() {
        // when
        sheet.addRow(s);
        sheet.addRow(s);

        throw new Error('expected exception');
      }).to.throw('element with id FOO already exists');

    }));

    it('should create a cell for each existing column', inject(function(sheet, elementRegistry) {

      //given
      var col1 = {id: 'c1'},
          col2 = {id: 'c2'},
          row  = {id: 'r'};

      sheet.addColumn(col1);
      sheet.addColumn(col2);

      // when
      sheet.addRow(row);

      // then
      expect(elementRegistry.get('cell_c1_r')).to.be.defined;
      expect(elementRegistry.get('cell_c2_r')).to.be.defined;

    }));

  });

  describe('#removeRow', function() {

    beforeEach(function() {
      container = TestContainer.get(this);
    });
    beforeEach(createTable());

    it('should fire <row.removed> event', inject(function(sheet, eventBus, elementRegistry) {

      // given
      var listener = sinon.spy();
      eventBus.on('row.removed', listener);

      sheet.addRow({ id: 'a' });

      // when
      var row = sheet.removeRow('a');

      // then
      expect(row.parent).to.be.null;
      expect(elementRegistry.get('a')).to.be.undefined;

      expect(listener).to.have.been.called;
    }));


    it('should remove row from registry', inject(function(sheet, elementRegistry) {

      // given
      sheet.addRow({ id: 'a' });

      // when
      sheet.removeRow('a');

      // then
      expect(elementRegistry.get('a')).to.be.undefined;
    }));

    it('should remove cells from the row', inject(function(sheet, elementRegistry) {

      //given
      var col1 = {id: 'c1'},
          col2 = {id: 'c2'},
          row  = {id: 'r'};

      sheet.addColumn(col1);
      sheet.addColumn(col2);
      sheet.addRow(row);

      // when
      sheet.removeRow(row);

      // then
      expect(elementRegistry.get('cell_c1_r')).to.be.undefined;
      expect(elementRegistry.get('cell_c2_r')).to.be.undefined;

    }));


  });


  describe('#addColumn', function() {

    beforeEach(function() {
      container = TestContainer.get(this);
    });
    beforeEach(createTable());


    it('should fire <column.added> event', inject(function(sheet, eventBus) {

      // given
      var listener = sinon.spy();

      eventBus.on('column.added', listener);

      // when
      sheet.addColumn({ id: 'c1' });

      // then
      expect(listener).to.have.been.called;
    }));


    it('should create cells for rows', inject(function(sheet, elementRegistry) {

      // given
      var row1 = {id: 'r1'},
          row2 = {id: 'r2'},
          column  = {id: 'c'};

      sheet.addRow(row1);
      sheet.addRow(row2);

      // when
      sheet.addColumn(column);

      // then
      expect(elementRegistry.get('cell_c_r1')).to.be.defined;
      expect(elementRegistry.get('cell_c_r2')).to.be.defined;

    }));
  });


  describe('#removeColumn', function() {

    beforeEach(function() {
      container = TestContainer.get(this);
    });

    beforeEach(createTable());


    it('should fire <column.removed> event', inject(function(sheet, eventBus, elementRegistry) {

      // given
      var listener = sinon.spy();

      sheet.addColumn({ id: 'c' });

      eventBus.on('column.removed', listener);

      // when
      sheet.removeColumn('c');

      // then
      expect(elementRegistry.get('c')).to.not.be.defined;

      expect(listener).to.have.been.called;
    }));

    it('should remove cells from the column', inject(function(sheet, elementRegistry) {

      //given
      var row1 = {id: 'r1'},
          row2 = {id: 'r2'},
          column  = {id: 'c'};

      sheet.addRow(row1);
      sheet.addRow(row2);
      sheet.addColumn(column);

      // when
      sheet.removeColumn(column);

      // then
      expect(elementRegistry.get('cell_c_r1')).to.be.undefined;
      expect(elementRegistry.get('cell_c_r2')).to.be.undefined;

    }));

  });


  describe('root element(s)', function() {

    beforeEach(function() {
      container = TestContainer.get(this);
    });
    beforeEach(createTable());


    it('should always return root element', inject(function(sheet) {
      // when
      // accessing root element for the first time
      expect(sheet.getRootElement()).to.be.defined;
    }));


    it('should have implicit root element', inject(function(sheet) {

      // when
      var a = sheet.addRow({ id: 'a' });
      var root = sheet.getRootElement();

      // then
      expect(a.parent).to.equal(root);
    }));

  });

});
