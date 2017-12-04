
// eslint-disable-next-line
import Inferno from 'inferno';

// eslint-disable-next-line
import Component from 'inferno-component';

import { findRenderedDOMElementWithClass, renderIntoDocument } from 'inferno-test-utils';

import { inject, bootstrap } from 'test/TestHelper';

import ContextMenuModule from 'lib/features/context-menu';
import ContextMenuComponent from 'lib/features/context-menu/components/ContextMenuComponent';


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


  it('should render context menu on contextMenu.open', inject(function(components, contextMenu, eventBus, injector) {

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
  }));

  // TODO(philippfromme): fix
  it.skip('should render context menu at position', inject(function(components, contextMenu, eventBus, injector) {
    
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
    expect(node.style.top).to.equal('100px');
    expect(node.style.left).to.equal('100px');
  }));


  it('should not render context menu on contextMenu.open if no components', inject(function(contextMenu, eventBus, injector) {

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
  }));


  it('should not render context menu on contextMenu.close', inject(function(components, contextMenu, eventBus, injector) {
    
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
  }));

});