'use strict';

var TestHelper = require('../../TestHelper');

/* global bootstrapTable, inject */
var merge = require('lodash/object/merge');
var TestContainer = require('mocha-test-container-support');

describe('ElementRegistry', function() {

  var container;

  /**
   * Create a diagram with the given options
   */
  function createTable(options) {

    return bootstrapTable(function() {
      return merge({ sheet: { container: container } }, options);
    }, {});
  }

  beforeEach(function() {
    container = TestContainer.get(this);
  });
  beforeEach(createTable());

  beforeEach(inject(function(sheet) {
    sheet.addRow({id: '1', foo: 'bar'});
    sheet.addRow({id: '2', foo: 'test'});
  }));

  describe('add', function() {

    it('should wire element', inject(function(elementRegistry, sheet) {

      // when
      sheet.addRow({ id: '3' });

      // then
      var element = elementRegistry.get('3'),
          gfx = elementRegistry.getGraphics(element);

      expect(element).to.exist;
      expect(gfx).to.exist;
    }));

  });


  describe('remove', function() {

    it('should wire element', inject(function(elementRegistry, sheet) {

      // when
      sheet.removeRow({id: '1'});

      // then
      var shape = elementRegistry.get('1'),
          gfx = elementRegistry.getGraphics('1');

      expect(shape).not.to.exist;
      expect(gfx).not.to.exist;
    }));

  });


  describe('updateId', function() {

    it('should update id', inject(function(elementRegistry, sheet) {

      // given
      var oldId = '1',
          newId = '56';

      var shape = elementRegistry.get(oldId);

      // when
      elementRegistry.updateId(shape, newId);

      // then
      var shapeByOldId = elementRegistry.get(oldId),
          gfxByOldId = elementRegistry.getGraphics(oldId);

      var shapeByNewId = elementRegistry.get(newId),
          gfxByNewId = elementRegistry.getGraphics(newId);

      expect(shapeByOldId).not.to.exist;
      expect(gfxByOldId).not.to.exist;

      expect(shapeByNewId).to.exist;
      expect(gfxByNewId).to.exist;
    }));


    it('should update by id', inject(function(elementRegistry, sheet) {

      // given
      var oldId = '1',
          newId = '56';

      elementRegistry.updateId(oldId, newId);

      // then
      var shapeByOldId = elementRegistry.get(oldId),
          gfxByOldId = elementRegistry.getGraphics(oldId);

      var shapeByNewId = elementRegistry.get(newId),
          gfxByNewId = elementRegistry.getGraphics(newId);

      expect(shapeByOldId).not.to.exist;
      expect(gfxByOldId).not.to.exist;

      expect(shapeByNewId).to.exist;
      expect(gfxByNewId).to.exist;
    }));

  });


  describe('getGraphics', function() {

    it('should get by id', inject(function(elementRegistry) {

      // when
      var gfx = elementRegistry.getGraphics('1');

      // then
      expect(gfx).to.exist;
    }));

  });


  describe('get', function() {

    it('should get by id', inject(function(elementRegistry) {

      // when
      var shape = elementRegistry.get('1');

      // then
      expect(shape).to.exist;
      expect(shape.id).to.equal('1');
    }));


    it('should get by graphics', inject(function(elementRegistry) {

      // given
      var gfx = elementRegistry.getGraphics('1');

      // when
      var shape = elementRegistry.get(gfx);

      // then
      expect(shape).to.exist;
      expect(shape.id).to.equal('1');
    }));

  });

  describe('filter', function() {

    it('should noop, returning all', inject(function(elementRegistry) {

      // when
      var elements = elementRegistry.filter(function(element, gfx) {

        // assume we get element and gfx as params
        expect(element).to.exist;
        expect(gfx).to.exist;

        return true;
      });

      // then
      // two shapes
      expect(elements.length).to.equal(2);
    }));


    it('should filtered', inject(function(elementRegistry) {

      // when
      var elements = elementRegistry.filter(function(s, gfx) {
        return s.foo === 'bar';
      });

      // then
      expect(elements.length).to.equal(1);
      expect(elements[0].foo).to.equal('bar');
    }));

  });

  describe('forEach', function() {

    it('should iterate over all', inject(function(elementRegistry) {

      // when
      var elements = [];

      elementRegistry.forEach(function(element, gfx) {
        elements.push(element);
        // assume we get element and gfx as params
        expect(element).to.exist;
        expect(gfx).to.exist;
      });

      // then
      // two shapes
      expect(elements.length).to.equal(2);
    }));

  });

});
