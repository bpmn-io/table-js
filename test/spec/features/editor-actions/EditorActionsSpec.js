import { inject, bootstrap } from 'test/TestHelper';

/* global sinon */

import EditorActionsModule from 'lib/features/editor-actions';
import ModelingModule from 'lib/features/modeling';


describe('EditorActions', function() {

  beforeEach(bootstrap({
    modules: [
      EditorActionsModule,
      ModelingModule
    ]
  }));


  it('should register', inject(function(editorActions) {

    // when
    editorActions.register('foo', () => {});

    // then
    expect(editorActions._actions['foo']).to.exist;
  }));


  it('should unregister', inject(function(editorActions) {

    // given
    const listener = () => {};

    editorActions.register('foo', listener);

    // when
    editorActions.unregister('foo', listener);

    // then
    expect(editorActions._actions['foo']).to.not.exist;
  }));


  it('should trigger', inject(function(editorActions) {

    // given
    const spy = sinon.spy();

    editorActions.register('foo', spy);

    // when
    editorActions.trigger('foo');

    // then
    expect(spy).to.have.been.called;
  }));


  it('should check if registered', inject(function(editorActions) {

    // given
    editorActions.register('foo', () => {});

    // when
    // then
    expect(editorActions.isRegistered('foo')).to.be.true;
  }));


  describe('default editor actions', function() {

    function expectRegistered(action) {
      return inject(function(editorActions) {
        expect(editorActions.isRegistered(action)).to.be.true;
      });
    }

    it('undo', expectRegistered('undo'));


    it('redo', expectRegistered('redo'));


    it('select', expectRegistered('select'));


    it('deselect', expectRegistered('deselect'));


    it('addRow', expectRegistered('addRow'));


    it('removeRow', expectRegistered('removeRow'));


    it('moveRow', expectRegistered('moveRow'));


    it('addCol', expectRegistered('addCol'));


    it('removeCol', expectRegistered('removeCol'));


    it('moveCol', expectRegistered('moveCol'));

  });

});