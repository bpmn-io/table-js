import {
  Component,
  render
} from 'inferno';

import TestContainerSupport from 'mocha-test-container-support';

import {
  findRenderedDOMElementWithClass
} from 'inferno-test-utils';

import { inject, bootstrap } from 'test/TestHelper';

import ContextMenuModule from 'lib/features/context-menu';
import ContextMenuComponent
  from 'lib/features/context-menu/components/ContextMenuComponent';


function withContext(WithoutContext, context) {

  return class WithContext extends Component {
    getChildContext() {
      return context;
    }

    render() {
      return <WithoutContext />;
    }
  };

}


describe('ContextMenuComponent', function() {

  beforeEach(bootstrap({
    modules: [ ContextMenuModule ]
  }));


  var container, vTree;

  function renderIntoDocument(vNode) {
    vTree = render(vNode, container);
    return vTree;
  }

  beforeEach(function() {
    container = TestContainerSupport.get(this);
  });

  afterEach(function() {
    render(null, container);
  });


  it('should render context menu on contextMenu.open', inject(
    function(components, contextMenu, eventBus, injector) {

      // given
      const WithContext = withContext(ContextMenuComponent, {
        injector,
        eventBus
      });

      const renderedTree = renderIntoDocument(<WithContext />);

      components.onGetComponent('context-menu', () => () => <div className="foo"></div>);

      // when
      contextMenu.open();

      // then
      expect(findRenderedDOMElementWithClass(renderedTree, 'context-menu')).to.exist;
      expect(findRenderedDOMElementWithClass(renderedTree, 'foo')).to.exist;
    }
  ));


  it('should render context menu at position', inject(
    function(components, contextMenu, eventBus, injector) {

      // given
      const WithContext = withContext(ContextMenuComponent, {
        injector,
        eventBus
      });

      const renderedTree = renderIntoDocument(<WithContext />);

      components.onGetComponent('context-menu', () => () => <div></div>);

      // when
      contextMenu.open({
        x: 100,
        y: 100
      });

      // then
      const node = findRenderedDOMElementWithClass(renderedTree, 'context-menu');

      expect(node).to.exist;
      expect(node.style.top).to.not.equal('');
      expect(node.style.left).to.not.equal('');
    }
  ));


  it('should ignore contextMenu.open if no components', inject(
    function(contextMenu, eventBus, injector) {

      // given
      const WithContext = withContext(ContextMenuComponent, {
        injector,
        eventBus
      });

      const renderedTree = renderIntoDocument(<WithContext />);

      // when
      contextMenu.open();

      // then
      const node = findRenderedDOMElementWithClass(renderedTree, 'context-menu');

      expect(node).to.not.exist;
    }
  ));


  it('should not render context menu on contextMenu.close', inject(
    function(components, contextMenu, eventBus, injector) {

      // given
      const WithContext = withContext(ContextMenuComponent, {
        injector,
        eventBus
      });

      const renderedTree = renderIntoDocument(<WithContext />);

      components.onGetComponent('context-menu', () => () => <div></div>);

      contextMenu.open();

      // when
      contextMenu.close();

      // then
      const node = findRenderedDOMElementWithClass(renderedTree, 'context-menu');

      expect(node).to.not.exist;
    }
  ));

});