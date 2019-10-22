import { Component } from 'inferno';

import {
  assign,
  isFunction
} from 'min-dash';

import {
  inject
} from '../../../components';

import {
  query as domQuery
} from 'min-dom';

import {
  setRange
} from 'selection-ranges';


export default class ContextMenuComponent extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      isOpen: false,
      position: {
        x: 0,
        y: 0
      }
    };

    inject(this);
  }

  /**
   * Open the context menu with given position and context.
   *
   * The menu itself will figure out the best position, taking the optional
   * positioning parameter into account.
   *
   * @param {Bounds|Point} position
   * @param {Object} [context]
   */
  open = ({ position, context }) => {

    // always close first
    this.close();

    this.setState({
      isOpen: true,
      position: position || { x: 0, y: 0 },
      context: context || {}
    });
  }

  /**
   * Closes context menu and resets state.
   */
  close = () => {

    if (this.state.isOpen) {
      this.setState({
        context: undefined,
        isOpen: false,
        position: {
          x: 0,
          y: 0
        }
      });
    }
  }

  triggerClose = () => {
    this.eventBus.fire('contextMenu.close');
  }

  componentDidMount() {
    this.eventBus.on('contextMenu.open', this.open);
    this.eventBus.on('contextMenu.close', this.close);
  }

  componentWillUnmount() {
    this.eventBus.off('contextMenu.open', this.open);
    this.eventBus.off('contextMenu.close', this.close);
  }

  render() {
    const {
      isOpen,
      context,
      position
    } = this.state;

    if (!isOpen) {
      return null;
    }

    const components = this.components.getComponents('context-menu', context);

    if (!components.length) {
      return null;
    }

    return (
      <ContextMenu
        className="context-menu no-deselect"
        context={ context }
        position={ position }
        offset={ context.offset || { x: 0, y: 0 } }
        autoFocus={ context.autoFocus !== false }
        autoClose={ context.autoClose !== false }
        components={ components }
        onClose={ this.triggerClose } />
    );
  }
}

ContextMenuComponent.$inject = [
  'eventBus',
  'components'
];


/**
 * Low-level, stateless context menu holder.
 */
class ContextMenu extends Component {

  constructor(props, context) {
    super(props, context);

    inject(this);
  }

  close() {

    const {
      onClose
    } = this.props;

    if (isFunction(onClose)) {
      onClose();
    }
  }


  /**
   * Check whether closing the context menu is necessary
   * after selecting the given element.
   */
  checkClose(focusTarget) {

    const {
      autoClose
    } = this.props;

    if (!autoClose) {
      return;
    }

    var node = this.node;

    if (!node) {
      return;
    }

    if (node === focusTarget) {
      return;
    }

    if (node.contains(focusTarget)) {
      return;
    }

    this.close();
  }

  /**
   * Handle global (window) click event.
   */
  onGlobalClick = (event) => {
    this.checkClose(event.target);
  }

  /**
   * Handle global key event.
   */
  onGlobalKey = (event) => {

    var keyCode = event.which;

    // ENTER or ESC
    if (keyCode === 13 || keyCode === 27) {
      event.stopPropagation();
      event.preventDefault();

      this.close();
    }
  }

  /**
   * Handle global (document) focus changed event.
   */
  onFocusChanged = (event) => {
    this.checkClose(event.target);
  }

  componentDidMount() {
    document.addEventListener('focusin', this.onFocusChanged);
    document.addEventListener('keydown', this.onGlobalKey);
    document.addEventListener('click', this.onGlobalClick);
  }

  componentWillUnmount() {
    document.removeEventListener('focusin', this.onFocusChanged);
    document.removeEventListener('keydown', this.onGlobalKey);
    document.removeEventListener('click', this.onGlobalClick);
  }

  setNode = (node) => {
    this.node = node;

    const {
      autoFocus
    } = this.props;

    if (node) {
      this.updatePosition();

      if (autoFocus) {
        ensureFocus(node);
      }
    }
  }

  /**
   * Find best context menu position and re-layout accordingly.
   */
  updatePosition() {

    const {
      position,
      offset
    } = this.props;

    const bounds = this.node.getBoundingClientRect();

    if (!position.width) {
      position.width = 0;
    }

    if (!position.height) {
      position.height = 0;
    }

    const container = this.renderer.getContainer();

    const containerBounds = container.getBoundingClientRect();

    if (containerBounds.width > containerBounds.height) {
      this.node.classList.add('horizontal');
      this.node.classList.remove('vertical');
    } else {
      this.node.classList.add('vertical');
      this.node.classList.remove('horizontal');
    }

    const { scrollLeft, scrollTop } = container;

    const style = {};

    if (position.x + (position.width / 2) > containerBounds.width / 2) {
      let left = position.x
        - containerBounds.left
        - bounds.width
        + offset.x
        + scrollLeft;

      left = clampNumber(
        left,
        0 + scrollLeft,
        containerBounds.width - bounds.width + scrollLeft
      );

      style.left = left + 'px';
    } else {
      let left = window.scrollX
        - containerBounds.left
        + position.x
        + position.width
        - offset.x
        + scrollLeft;

      left = clampNumber(
        left,
        0 + scrollLeft,
        containerBounds.width - bounds.width + scrollLeft
      );

      style.left = left + 'px';
    }

    let top;

    if (position.y + (position.height / 2) > containerBounds.height / 2) {
      top = position.y
        - containerBounds.top
        - bounds.height
        + offset.y
        + scrollTop;

      top = clampNumber(
        top,
        0 + scrollTop,
        containerBounds.height - bounds.height + scrollTop
      );

      style.top = top + 'px';
    } else {
      top = window.scrollY
        - containerBounds.top
        + position.y
        - offset.y
        + scrollTop;

      top = clampNumber(
        top,
        0 + scrollTop,
        containerBounds.height - bounds.height + scrollTop
      );

      style.top = top + 'px';
    }

    // ensure context menu will always be accessible
    style.overflowY = 'auto';
    style.maxHeight = (containerBounds.height - top + scrollTop) + 'px';

    assign(this.node.style, style);
  }


  render() {

    const {
      context,
      components,
      className
    } = this.props;

    return (
      <div
        ref={ this.setNode }
        onContextMenu={ e => e.preventDefault() }
        className={ className }>
        {
          components.map(
            (Component, idx) => <Component key={ idx } context={ context } />
          )
        }
      </div>
    );
  }
}

ContextMenu.$inject = [
  'renderer'
];


// helpers /////////////

function clampNumber(number, min, max) {
  return Math.max(min, Math.min(max, number));
}

const SELECTABLE_ELEMENTS = `
  input[type=text],
  input[type=number],
  input[type=button],
  input[type=submit],
  [contenteditable],
  [tabindex],
  a[href],
  textarea,
  button
`;

function ensureFocus(el) {

  var focusEl = domQuery(SELECTABLE_ELEMENTS, el);

  if (focusEl) {
    focusEl.focus();

    // inputs
    if (focusEl.selectionStart && focusEl.type === 'text') {
      focusEl.selectionStart = 100000;
    } else

    // content editable elements
    if ('contentEditable' in focusEl) {
      setRange(focusEl, { start: 100000, end: 100000 });
    }
  }
}