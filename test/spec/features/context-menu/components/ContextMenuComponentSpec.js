import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { mount } from 'enzyme';

import TestContainerSupport from 'mocha-test-container-support';

import { inject, bootstrap } from 'test/TestHelper';

import ContextMenuModule from 'src/features/context-menu';
import ContextMenuComponent
  from 'src/features/context-menu/components/ContextMenuComponent';


function withContext(WithoutContext, context) {
  class WithContext extends PureComponent {
    getChildContext() {
      return context;
    }

    render() {
      return <WithoutContext />;
    }
  }

  WithContext.childContextTypes =
    Object.keys(context).reduce((childContextTypes, key) => {
      return Object.assign(childContextTypes, {
        [ key ]: PropTypes.any
      });
    }, {});

  return WithContext;
}


describe('features/context-menu - ContextMenuComponent', function() {

  beforeEach(bootstrap({
    modules: [ ContextMenuModule ]
  }));


  let container;

  function mountAndAttach(Component) {
    return mount(Component, {
      attachTo: container
    });
  }

  beforeEach(function() {
    container = TestContainerSupport.get(this);
  });

  afterEach(function() {
    ReactDOM.render(null, container);
  });


  it('should render context menu on contextMenu.open', inject(
    function(components, contextMenu, eventBus, injector) {

      // given
      const WithContext = withContext(ContextMenuComponent, {
        eventBus,
        injector
      });

      const wrapper = mountAndAttach(<WithContext />);

      components.onGetComponent('context-menu', () => () => <div className="foo"></div>);

      // when
      contextMenu.open();

      // then
      process.nextTick(() => {
        expect(wrapper.find('.context-menu')).to.have.lengthOf(1);
        expect(wrapper.find('.foo')).to.have.lengthOf(1);
      });
    }
  ));


  describe('should automatically close', function() {

    let wrapper;

    beforeEach(inject(function(components, eventBus, injector) {

      // given
      const WithContext = withContext(ContextMenuComponent, {
        eventBus,
        injector
      });

      wrapper = mountAndAttach(<WithContext />);

      components.onGetComponent('context-menu', () => () => <div></div>);
    }));


    it('on global click', inject(function(contextMenu) {

      // given
      contextMenu.open();

      // when
      triggerClick(document.body);

      // then
      expect(wrapper.find('.context-menu')).to.have.lengthOf(0);
    }));


    it('on blur', inject(function(contextMenu) {

      // given
      contextMenu.open();

      // when
      triggerFocusIn(document.body);

      // then
      expect(wrapper.find('.context-menu')).to.have.lengthOf(0);
    }));


    it('on mousedown outside of context menu', inject(function(contextMenu) {

      // given
      contextMenu.open();

      // when
      triggerMouseEvent(document.body, 'mousedown');

      // then
      expect(wrapper.find('.context-menu')).to.have.lengthOf(0);

    }));


    it('unless click was started inside context menu', inject(
      function(contextMenu) {

        // given
        contextMenu.open();
        const element = wrapper.find('.context-menu');

        // when
        triggerMouseEvent(element, 'mousedown');
        triggerMouseEvent(document.body, 'mouseup');
        triggerMouseEvent(document.body, 'click');

        // then
        expect(
          findRenderedDOMComponentWithClass(wrapper, 'context-menu')
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
          findRenderedDOMComponentWithClass(wrapper, 'context-menu')
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
          findRenderedDOMComponentWithClass(wrapper, 'context-menu')
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

      renderedTree = mountAndAttach(<WithContext />);
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
        var inputEl = findRenderedDOMComponentWithClass(renderedTree, 'test-input');

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
        var inputEl = findRenderedDOMComponentWithClass(renderedTree, 'test-input');

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


      // skip on Firefox due to inconsistent focus handling,
      // cf. https://github.com/bpmn-io/table-js/pull/25 and linked sources
      (isFirefox() ? it.skip : it)('on open', inject(function(contextMenu) {

        // when
        contextMenu.open();

        // then
        var inputEl = findRenderedDOMComponentWithClass(renderedTree, 'test-input');

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
        var inputEl = findRenderedDOMComponentWithClass(renderedTree, 'test-input');

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
        findRenderedDOMComponentWithClass(renderedTree, 'test-contenteditable');

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
        findRenderedDOMComponentWithClass(renderedTree, 'test-contenteditable');

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

      const renderedTree = mountAndAttach(<WithContext />);

      components.onGetComponent('context-menu', () => () => <div></div>);

      // when
      contextMenu.open({
        x: 100,
        y: 100
      });

      // then
      const node = findRenderedDOMComponentWithClass(renderedTree, 'context-menu');

      expect(node).to.exist;
      expect(node.style.top).to.not.equal('');
      expect(node.style.left).to.not.equal('');
    }
  ));

  // skip on Firefox due to inconsistent focus handling,
  // cf. https://github.com/bpmn-io/table-js/pull/25 and linked sources
  (
    isFirefox() ? it.skip : it
  )('should set position before the context menu is focused', function(done) {
    const test = inject(
      function(components, contextMenu, eventBus, injector) {

        // given
        const WithContext = withContext(ContextMenuComponent, {
          components,
          injector,
          eventBus
        });

        const renderedTree = mountAndAttach(<WithContext />);

        components.onGetComponent(
          'context-menu',
          () => () => <input type="text" onFocus={ onFocus } className="test-input" />
        );

        // when
        contextMenu.open({
          x: 100,
          y: 100
        }, { autoFocus: true });

        // then
        function onFocus() {
          try {
            const node = findRenderedDOMComponentWithClass(renderedTree, 'context-menu');

            expect(node).to.exist;
            expect(node.style.top).to.not.equal('');
            expect(node.style.left).to.not.equal('');

            done();
          } catch (error) {
            done(error);
          }
        }
      }
    );

    test();
  });




  it('should ignore contextMenu.open if no components', inject(
    function(contextMenu, eventBus, injector) {

      // given
      const WithContext = withContext(ContextMenuComponent, {
        injector,
        eventBus
      });

      const renderedTree = mountAndAttach(<WithContext />);

      // when
      contextMenu.open();

      // then
      const node = findRenderedDOMComponentWithClass(renderedTree, 'context-menu');

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

      const renderedTree = mountAndAttach(<WithContext />);

      components.onGetComponent('context-menu', () => () => <div></div>);

      contextMenu.open();

      // when
      contextMenu.close();

      // then
      const node = findRenderedDOMComponentWithClass(renderedTree, 'context-menu');

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

function isFirefox() {
  return window.navigator &&
    window.navigator.userAgent &&
    /Firefox/.test(window.navigator.userAgent);
}