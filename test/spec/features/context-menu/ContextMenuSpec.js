import { query as domQuery } from 'min-dom';

import { inject, bootstrap } from 'test/TestHelper';

import ContextMenuModule from 'src/features/context-menu';

import TestContainer from 'mocha-test-container-support';


describe('ContextMenu', function() {

  let testContainer;

  beforeEach(bootstrap({
    modules: [ ContextMenuModule ]
  }));

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  beforeEach(inject(function(eventBus, sheet) {
    eventBus.fire('elements.changed', { elements: [ sheet.getRoot() ] });
  }));


  it('should open', inject(function(components, contextMenu) {

    // given
    components.onGetComponent('context-menu', () => () => 'FOO');

    // when
    contextMenu.open();

    // expect
    expect(domQuery('.context-menu', testContainer)).to.exist;
  }));


  it('should close', inject(function(components, contextMenu) {

    // given
    components.onGetComponent('context-menu', () => () => 'FOO');
    contextMenu.open();

    // when
    contextMenu.close();

    // expect
    expect(domQuery('.context-menu', testContainer)).to.not.exist;
  }));

});