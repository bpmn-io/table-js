import {
  Component,
  render
} from 'inferno';


import TestContainerSupport from 'mocha-test-container-support';

import {
  findRenderedDOMElementWithClass
} from 'inferno-test-utils';

import { inject, bootstrap } from 'test/TestHelper';

import ContextMenuModule from 'src/features/context-menu';
import ContextMenuComponent
  from 'src/features/context-menu/components/ContextMenuComponent';


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


describe('features/context-menu - ContextMenuComponent', function() {

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


  describe('should automatically close', function() {

    let renderedTree;

    beforeEach(inject(function(components, eventBus, injector) {

      // given
      const WithContext = withContext(ContextMenuComponent, {
        injector,
        eventBus
      });

      renderedTree = renderIntoDocument(<WithContext />);

      components.onGetComponent('context-menu', () => () => <div></div>);
    }));


    it('on global click', inject(function(contextMenu) {

      // given
      contextMenu.open();

      // when
      triggerClick(document.body);

      // then
      expect(
        findRenderedDOMElementWithClass(renderedTree, 'context-menu')
      ).not.to.exist;
    }));


    it('on blur', inject(function(contextMenu) {

      // given
      contextMenu.open();

      // when
      triggerFocusIn(document.body);

      // then
      expect(
        findRenderedDOMElementWithClass(renderedTree, 'context-menu')
      ).not.to.exist;
    }));


    it('on mousedown outside of context menu', inject(function(contextMenu) {

      // given
      contextMenu.open();

      // when
      triggerMouseEvent(document.body, 'mousedown');

      // then
      expect(
        findRenderedDOMElementWithClass(renderedTree, 'context-menu')
      ).not.to.exist;
    }));


    it('unless click was started inside context menu', inject(
      function(contextMenu) {

        // given
        contextMenu.open();
        const element = findRenderedDOMElementWithClass(renderedTree, 'context-menu');

        // when
        triggerMouseEvent(element, 'mousedown');
        triggerMouseEvent(document.body, 'mouseup');
        triggerMouseEvent(document.body, 'click');

        // then
        expect(
          findRenderedDOMElementWithClass(renderedTree, 'context-menu')
        ).to.exist;
      })
    );


    describe('unless autoClose=false', function() {

      it('on global click', inject(function(contextMenu) {

        // given
        contextMenu.open(null, {
          autoClose: false
        });

        // when
        triggerClick(document.body);

        // then
        expect(
          findRenderedDOMElementWithClass(renderedTree, 'context-menu')
        ).to.exist;
      }));


      it('on blur', inject(function(contextMenu) {

        // given
        contextMenu.open(null, {
          autoClose: false
        });

        // when
        triggerFocusIn(document.body);

        // then
        expect(
          findRenderedDOMElementWithClass(renderedTree, 'context-menu')
        ).to.exist;
      }));

    });

  });


  describe('should automatically focus', function() {

    let renderedTree;

    beforeEach(inject(function(eventBus, injector) {

      // given
      const WithContext = withContext(ContextMenuComponent, {
        injector,
        eventBus
      });

      renderedTree = renderIntoDocument(<WithContext />);
    }));


    describe('text input', function() {

      beforeEach(inject(function(components, eventBus, injector) {
        components.onGetComponent(
          'context-menu',
          () => () => <input type="text" className="test-input" />
        );
      }));


      it('on open', inject(function(contextMenu) {

        // when
        contextMenu.open();

        // then
        var inputEl = findRenderedDOMElementWithClass(renderedTree, 'test-input');

        expect(
          document.activeElement
        ).to.equal(inputEl);
      }));


      it('unless autoFocus=false', inject(function(contextMenu) {

        // when
        contextMenu.open(null, {
          autoFocus: false
        });

        // then
        var inputEl = findRenderedDOMElementWithClass(renderedTree, 'test-input');

        expect(
          document.activeElement
        ).not.to.equal(inputEl);
      }));

    });


    describe('number input', function() {

      beforeEach(inject(function(components, eventBus, injector) {
        components.onGetComponent(
          'context-menu',
          () => () => <input type="number" className="test-input" />
        );
      }));


      it('on open', inject(function(contextMenu) {

        // when
        contextMenu.open();

        // then
        var inputEl = findRenderedDOMElementWithClass(renderedTree, 'test-input');

        expect(
          document.activeElement
        ).to.equal(inputEl);
      }));


      it('unless autoFocus=false', inject(function(contextMenu) {

        // when
        contextMenu.open(null, {
          autoFocus: false
        });

        // then
        var inputEl = findRenderedDOMElementWithClass(renderedTree, 'test-input');

        expect(
          document.activeElement
        ).not.to.equal(inputEl);
      }));

    });


    describe('contenteditable', function() {

      beforeEach(inject(function(components, eventBus, injector) {
        components.onGetComponent(
          'context-menu',
          () => () => <div contentEditable="true" className="test-contenteditable" />
        );
      }));


      it('on open', inject(function(contextMenu) {

        // when
        contextMenu.open();

        // then
        var inputEl =
          findRenderedDOMElementWithClass(renderedTree, 'test-contenteditable');

        expect(
          document.activeElement
        ).to.equal(inputEl);
      }));


      it('unless autoFocus=false', inject(function(contextMenu) {

        // when
        contextMenu.open(null, {
          autoFocus: false
        });

        // then
        var inputEl =
          findRenderedDOMElementWithClass(renderedTree, 'test-contenteditable');

        expect(
          document.activeElement
        ).not.to.equal(inputEl);
      }));

    });

  });


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


// helpers /////////////////////

function triggerClick(el, clientX, clientY, ctrlKey) {
  triggerMouseEvent(el, 'mousedown', clientX, clientY, ctrlKey);
  triggerMouseEvent(el, 'mouseup', clientX, clientY, ctrlKey);
  triggerMouseEvent(el, 'click', clientX, clientY, ctrlKey);
}

function triggerMouseEvent(element, event, clientX, clientY, ctrlKey = false) {
  const e = document.createEvent('MouseEvent');

  if (e.initMouseEvent) {
    e.initMouseEvent(
      event, true, true, window, 0, 0, 0,
      clientX, clientY, ctrlKey, false, false, false,
      0, null
    );
  }

  element.dispatchEvent(e);
}

function triggerEvent(element, name, eventType, bubbles=false) {
  const event = document.createEvent(eventType);

  event.initEvent(name, bubbles, true);

  return element.dispatchEvent(event);
}

function triggerFocusIn(element) {
  return triggerEvent(element, 'focusin', 'UIEvents', true);
}