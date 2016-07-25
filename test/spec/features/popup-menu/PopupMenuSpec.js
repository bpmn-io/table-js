'use strict';

require('../../../TestHelper');

/* global bootstrapTable, inject */

//var fs = require('fs');

var domQuery = require('min-dom/lib/query'),
    domClasses = require('min-dom/lib/classes'),
    Events = require('../../../util/Events'),
    popupMenuModule = require('../../../../lib/features/popup-menu');


function queryPopup(popupMenu, selector) {
  return domQuery(selector, popupMenu._current.container);
}

describe('features/popup', function() {

  beforeEach(bootstrapTable({ modules: [ popupMenuModule ] }));

  describe('bootstrap', function() {

    it('overlay to be defined', inject(function(popupMenu) {
      expect(popupMenu).to.be.defined;
      expect(popupMenu.open).to.be.defined;
    }));
  });


  describe('#open', function() {

    it('should throw an exception when the entries argument is missing', inject(function(popupMenu) {

      expect(function() {
        popupMenu.open({ position: { x: 100, y: 100 } });
      }).to.throw('the entries argument is missing');
    }));


    it('should throw an exception when the entry id argument is missing', inject(function(popupMenu) {

      expect(function() {
        popupMenu.open({ position: { x: 100, y: 100 }, entries: [{ label: 'foo' }] });
      }).to.throw('every entry must have the id property set');
    }));


    it('should return popup instance', inject(function(popupMenu) {

      // when
      var popup = popupMenu.open({ position: { x: 100, y: 100 }, entries: [] });

      // then
      expect(popup).to.be.defined;
    }));


    it('should attach popup to html', inject(function(popupMenu) {

      // when
      popupMenu.open({ position: { x: 100, y: 100 }, entries: [], className: 'test-popup' });

      // then
      var container = popupMenu._current.container;
      expect(domClasses(container).has('tjs-context-menu')).to.be.true;
      expect(domClasses(container).has('test-popup')).to.be.true;
    }));


    it('should add entries to menu', inject(function(popupMenu) {

      // when
      popupMenu.open({
        position: { x: 100, y: 100 },
        entries: [
          { id: 'id1', content: { label: 'Entry 1', className:'firstEntry' } },
          { id: 'id2', content: { label: 'Entry 2' } },
          { id: 'id3', content: { label: 'Entry 3' } },
          { id: 'id4', content: [
          { id: 'id5', content: { label: 'Entry 4', className:'firstEntry' } },
          { id: 'id6', content: { label: 'Entry 5' } },
          { id: 'id7', content: { label: 'Entry 6' } }
          ] }
        ]
      });

      // then
      var element = queryPopup(popupMenu, '.firstEntry');
      expect(element.textContent).to.eql('Entry 1');
    }));


    it('should add action-id to entry', inject(function(popupMenu) {

      // when
      popupMenu.open({
        position: { x: 100, y: 100 },
        entries: [
          { id: 'save', content: { label: 'SAVE' } },
          { id: 'load', content: { label: 'LOAD' } },
          { id: 'undo', content: { label: 'UNDO' } }
        ]
      });

      // then
      var parent = queryPopup(popupMenu, '.tjs-dropdown-menu');
      var entry1 = parent.childNodes[0];
      var entry2 = parent.childNodes[1];
      var entry3 = parent.childNodes[2];

      expect(entry1.getAttribute('data-id')).to.eql('save');
      expect(entry2.getAttribute('data-id')).to.eql('load');
      expect(entry3.getAttribute('data-id')).to.eql('undo');
    }));
  });


  describe('#close', function() {

    it('should remove DOM', inject(function(popupMenu) {

      // given
      popupMenu.open({
        position: { x: 100, y: 100 },
        entries: []
      });

      // when
      popupMenu.close();

      // then
      var open = popupMenu.isOpen();

      expect(open).to.be.false;
    }));


    it('should not fail if already closed', inject(function(popupMenu) {

      // given
      popupMenu.open({
        position: { x: 100, y: 100 },
        entries: []
      });

      // when
      popupMenu.close();

      // then
      expect(function() {
        popupMenu.close();
      }).not.to.throw;
    }));
  });


  describe('#trigger', function() {

    it('should trigger the right action handler', inject(function(popupMenu) {

      var entry, evt, trigger;

      // given
      popupMenu.open({
        position: { x: 100, y: 100 },
        entries: [
          {
            id: '1',
            action: function(event, entry) {
              return 'Entry 1';
            },
            content: {
              label: 'Entry 1',
              className: 'Entry_1'
            }
          }, {
            id: '2',
            action: function(event, entry) {
              return 'Entry 2';
            },
            content: {
              label: 'Entry 2',
              className: 'Entry_2'
            }
          }
        ]
      });

      entry = queryPopup(popupMenu, '.Entry_2');
      evt = Events.create(entry, { x: 0, y: 0 });

      // when
      trigger = popupMenu.trigger(evt);

      // then
      expect(trigger).to.eql('Entry 2');
    }));

  });


  describe('menu styling', function() {

    it('should add standard class to entry', inject(function(popupMenu) {

      // when
      popupMenu.open(
        {
          position: { x: 100, y: 100 },
          entries: [
            { id: '1', content: { label: 'Entry 1' } },
            { id: '2', content: { label: 'Entry 2' } }
          ]
        }
      );

      // then
      var elements = domQuery.all('.tjs-entry', popupMenu._current.container);
      expect(elements.length).to.eql(2);
    }));


    it('should add custom class to entry if specfied', inject(function(popupMenu) {

      popupMenu.open(
        {
          position: { x: 100, y: 100 },
          entries: [
            { id: '1', content: { label: 'Entry 1' } },
            { id: '2', content: { label: 'Entry 2 - special', className: 'special-entry' } }
          ]
        }
      );

      // then
      var element = queryPopup(popupMenu, '.special-entry');
      expect(element.textContent).to.eql('Entry 2 - special');
    }));

  });


  describe('singleton handling', function() {

    it('should update the popup menu, when it is opened again' , inject(function(popupMenu) {

      // when
      popupMenu.open(
        {
          className: 'popup-menu1',
          position: { x: 100, y: 100 },
          entries: [
            { id: '1', content: { label: 'Entry 1' } },
            { id: '2', content: { label: 'Entry 2' } }
          ]
        }
      );

      popupMenu.open(
        {
          className: 'popup-menu2',
          position: { x: 200, y: 200 },
          entries: [
            { id: '1', content: { label: 'Entry A' } },
            { id: '2', content: { label: 'Entry B' } }
          ]
        }
      );

      var container = popupMenu._current.container,
          entriesContainer = domQuery('.tjs-dropdown-menu', container);

      // then
      expect(domClasses(container).has('popup-menu2')).to.be.true;
      expect(container.style.left).to.eql('200px');
      expect(container.style.top).to.eql('200px');
      expect(entriesContainer.childNodes[0].textContent).to.eql('Entry A');
      expect(entriesContainer.childNodes[1].textContent).to.eql('Entry B');
    }));

  });


  describe('#isOpen', function() {

    it('should not be open initially', inject(function(popupMenu) {

      // when
      // at initial state

      // then
      expect(popupMenu.isOpen()).to.be.false;
    }));


    it('should be open after opening', inject(function(popupMenu) {
      // when
      popupMenu.open({ position: { x: 100, y: 100 }, entries: [] });

      // then
      expect(popupMenu.isOpen()).to.be.true;
    }));


    it('should be closed after closing', inject(function(popupMenu) {

      // given
      popupMenu.open({ position: { x: 100, y: 100 }, entries: [] });

      // when
      popupMenu.close();

      // then
      expect(popupMenu.isOpen()).to.be.false;
    }));

  });


  describe('#update', function() {

    it('should update an entry by id', inject(function(popupMenu) {

      // given
      popupMenu.open({
        entries: [
          {
            id: 'my-entry',
            content: { label: 'foo' }
          }
        ],
        position: { x: 100, y: 100 }
      });

      // when
      popupMenu.update('my-entry', { label: 'bar' });

      // then
      expect(popupMenu._getEntry('my-entry').label).to.eql('bar');
    }));


    it('should update an entry by instance', inject(function(popupMenu) {

      // given
      popupMenu.open({
        entries: [
          {
            id: 'my-entry',
            content: { label: 'foo' }
          }
        ],
        position: { x: 100, y: 100 }
      });

      var entry = popupMenu._current.menu.entries[0];

      // when
      popupMenu.update(entry, { label: 'bar' });

      // then
      expect(popupMenu._getEntry('my-entry').label).to.eql('bar');
    }));


    it('should throw an error if no entry could be found', inject(function(popupMenu) {

      // given
      popupMenu.open({
        entries: [],
        position: { x: 100, y: 100 }
      });

      // when
      expect(function() {
        popupMenu.update('non-existent-entry', { foo: 'bar' });
      }).to.throw('entry not found');
    }));

  });

});
