'use strict';

require('../../../TestHelper');

/* global bootstrapTable, inject */

var editorActionsModule = require('../../../../lib/features/editor-actions'),
    tableNameModule = require('../../../../lib/features/table-name'),
    modelingModule = require('../../../../lib/features/modeling');


describe('features/editor-actions', function() {

  beforeEach(bootstrapTable({ modules: [ editorActionsModule, modelingModule, tableNameModule ] }));

  describe('trigger', function() {

    it('should trigger an action', inject(function(modeling, editorActions, elementRegistry) {
      // given
      var newRow = modeling.createRow({ id: 'row' });

      // when
      editorActions.trigger('undo');

      // then
      expect(newRow.parent).to.be.null;
      expect(elementRegistry.getGraphics(newRow)).to.not.exist;
    }));


    it('should NOT trigger an action', inject(function(editorActions) {
      // when
      function trigger() {
        editorActions.trigger('foo');
      }

      // then
      expect(trigger).to.throw('foo is not a registered action');
    }));

  });


  describe('register actions', function() {

    it('should register a list of actions', inject(function(editorActions) {
      // given
      var numOfActions = editorActions.length();

      // when
      editorActions.register({
        'foo': function() {
          return 'bar';
        },
        'bar': function() {
          return 'foo';
        }
      });

      // then
      expect(editorActions.length()).to.equal(numOfActions + 2);
    }));


    it('should register action', inject(function(editorActions) {
      // when
      editorActions.register('foo', function() {
        return 'bar';
      });

      var result = editorActions.trigger('foo');

      // then
      expect(result).to.equal('bar');
      expect(editorActions.isRegistered('foo')).to.be.true;
    }));


    it('should throw error on duplicate registration', inject(function(editorActions) {
      // when
      function register() {
        editorActions.register('undo', function() {
          return 'bar';
        });
      }

      // then
      expect(register).to.throw('undo is already registered');
    }));


    it('should unregister an action', inject(function(editorActions) {
      // when
      editorActions.unregister('undo');

      var result = editorActions.isRegistered('undo');

      // then
      expect(result).to.be.false;
    }));


    it('should throw an error on deregisering unregistered', inject(function(editorActions) {
      // when
      function unregister() {
        editorActions.unregister('bar');
      }

      // then
      expect(unregister).to.throw('bar is not a registered action');
    }));

  });


  describe('utilities', function() {

    it('listActions', inject(function(editorActions) {
      // when
      var actionsLength = editorActions.length();

      // then
      expect(actionsLength).to.equal(2);
    }));


    it('isRegistered -> true', inject(function(editorActions) {
      // when
      var undo = editorActions.isRegistered('undo'),
          foo = editorActions.isRegistered('foo');

      // then
      expect(undo).to.be.true;
      expect(foo).to.be.false;
    }));

  });

});
