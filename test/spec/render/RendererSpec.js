
// eslint-disable-next-line
import Inferno from 'inferno';

import { query as domQuery } from 'min-dom';

import { bootstrap, inject } from 'test/TestHelper';

import TestContainer from 'mocha-test-container-support';


describe('Renderer', function() {

  let testContainer;

  beforeEach(bootstrap());

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should render', function() {
    
    // then
    expect(domQuery('.tjs-container')).to.exist;
    expect(domQuery('.tjs-table')).to.exist;
  });


  it('should render null', inject(function(eventBus, sheet) {

    // given
    const root = sheet.getRoot();

    // when
    eventBus.fire('root.remove', { root });

    // then
    expect(domQuery('.tjs-container', testContainer)).to.not.exist;
    expect(domQuery('.tjs-table', testContainer)).to.not.exist;
  }));


  it('should rerender', inject(function(eventBus, sheet) {

    // given
    const root = sheet.getRoot();

    eventBus.fire('root.remove', { root });

    // when
    eventBus.fire('root.added', {
      root: {
        id: '__implicitroot',
        rows: [],
        cols: []
      }
    });

    // then
    expect(domQuery('.tjs-container', testContainer)).to.exist;
    expect(domQuery('.tjs-table', testContainer)).to.exist;
  }));


  it('should return container', inject(function(renderer) {
    
    // when
    const container = renderer.getContainer();

    // then
    expect(container).to.exist;
  }));

});