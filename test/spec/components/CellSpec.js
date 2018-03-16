import {
  render
} from 'inferno';

import {
  Cell,
  DiContainer
} from 'lib/components';

import {
  findRenderedDOMElementWithClass
} from 'inferno-test-utils';

import {
  matches
} from 'min-dom';

import {
  createInjector
} from 'test/util';

import EventBus from 'diagram-js/lib/core/EventBus';


describe('components/Cell', function() {

  let container;

  function mount(vNode) {

    const {
      node,
      tree
    } = createMount(vNode);

    container = node;

    return tree;
  }

  afterEach(function() {

    if (container) {
      unmount(container);
      container = null;
    }
  });


  it('should render as <td class=...>', function() {

    function TestCell() {
      return (
        <Cell elementId="foo" className="foo" autoFocus="true" />
      );
    }

    const injector = createInjector({
      eventBus: new EventBus()
    });

    // when
    const tree = mount(
      <DiContainer injector={ injector }>
        <TestCell />
      </DiContainer>
    );

    // then
    const node = findRenderedDOMElementWithClass(tree, 'cell');

    expect(node).to.exist;
    expect(node.autofocus).to.be.true;

    expect(matches(node, '.selected')).to.be.false;

    // node selection changed
    injector.get('eventBus').fire('selection.foo.changed', { selected: true });

    expect(matches(node, '.selected')).to.be.true;
    expect(matches(node, '.selected-secondary')).to.be.false;

    injector.get('eventBus').fire('selection.foo.changed', {
      selected: false,
      selectedSecondary: true
    });

    expect(matches(node, '.selected')).to.be.false;
    expect(matches(node, '.selected-secondary')).to.be.true;
  });

});


// helpers ////////////////////

function createMount(vNode) {

  var container = document.createElement('div');

  document.body.appendChild(container);

  return {
    _container: container,
    tree: render(vNode, container)
  };
}

function unmount(node) {
  render(node, null);

  node.parentNode.removeChild(node);
}