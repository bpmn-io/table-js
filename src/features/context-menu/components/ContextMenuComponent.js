import { Component } from 'inferno';

import {
  assign,
  isFunction
} from 'min-dash';

import {
  inject
} from '../../../components';

import {
  closest as domClosest,
  query as domQuery
} from 'min-dom';

import {
  setRange
} from 'selection-ranges';

const DEFAULT_STYLE = {
  position: 'absolute'
};

/**
 * @typedef ContextMenuPosition
 * @property {number} x
 * @property {number} y
 * @property {number} [width=0]
 * @property {number} [height=0]
 * @property {'bottom-left'|'bottom-right'|'top-left'|'top-right'} [align]
 */

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
   * positioning parameter into account. Position can also contain indicator
   * in which direction to open context menu.
   *
   * @param { {
   *   position: ContextMenuPosition,
   *   context: any
   * } } options
   */
  open = ({ position, context }) => {

    // always close first
    this.close();

    this.setState({
      isOpen: true,
      position: position || { x: 0, y: 0 },
      context: context || {}
    });
  };

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
  };

  triggerClose = () => {
    this.eventBus.fire('contextMenu.close');
  };

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
   * Handle global (window) mousedown event.
   */
  onGlobalMouseDown = (event) => {
    this.checkClose(event.target);
  };

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
  };

  /**
   * Handle global (document) focus changed event.
   */
  onFocusChanged = (event) => {
    this.checkClose(event.target);
  };

  componentDidMount() {
    document.addEventListener('focusin', this.onFocusChanged);
    document.addEventListener('keydown', this.onGlobalKey);
    document.addEventListener('mousedown', this.onGlobalMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('focusin', this.onFocusChanged);
    document.removeEventListener('keydown', this.onGlobalKey);
    document.removeEventListener('mousedown', this.onGlobalMouseDown);
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
  };

  /**
   * Find best context menu position and re-layout accordingly.
   */
  updatePosition() {
    const {
      position,
      offset
    } = this.props;

    const { node } = this;

    const bounds = node.getBoundingClientRect();

    if (!position.width) {
      position.width = 0;
    }

    if (!position.height) {
      position.height = 0;
    }

    const container = this.renderer.getContainer(),
          containerBounds = container.getBoundingClientRect();

    if (containerBounds.width > containerBounds.height) {
      this.node.classList.add('horizontal');
      this.node.classList.remove('vertical');
    } else {
      this.node.classList.add('vertical');
      this.node.classList.remove('horizontal');
    }

    const { scrollLeft, scrollTop } = getTableContainerScroll(node);

    const style = {};

    let alignment;

    if (position.align) {
      alignment = position.align.split('-');
    }

    let left, top;

    const horizontalAlignment = alignment && alignment[1] || (
      position.x + (position.width / 2) > containerBounds.width / 2
        ? 'left'
        : 'right'
    );

    if (horizontalAlignment === 'left') {
      left = position.x
        - containerBounds.left
        - bounds.width
        + offset.x
        + scrollLeft;

      node.classList.remove('right');
      node.classList.add('left');
    } else {
      left = -containerBounds.left
        + position.x
        + position.width
        - offset.x
        + scrollLeft;

      node.classList.remove('left');
      node.classList.add('right');
    }
    left = alignment ? left : clampNumber(
      left,
      0 + scrollLeft,
      containerBounds.width - bounds.width + scrollLeft
    );
    style.left = left + 'px';

    const verticalAlignment = alignment && alignment[0] || (
      position.y + (position.height / 2) > containerBounds.height / 2
        ? 'top'
        : 'bottom'
    );

    if (verticalAlignment === 'top') {
      top = position.y
        - containerBounds.top
        - bounds.height
        + offset.y
        + scrollTop;

      node.classList.remove('bottom');
      node.classList.add('top');
    } else {
      top = -containerBounds.top
        + position.y
        - offset.y
        + scrollTop;

      node.classList.remove('top');
      node.classList.add('bottom');
    }
    top = alignment ? top : clampNumber(
      top,
      0 + scrollTop,
      containerBounds.height - bounds.height + scrollTop
    );
    style.top = top + 'px';

    // ensure context menu will always be accessible
    style.overflowY = 'auto';
    style.maxHeight = (containerBounds.height - top + scrollTop) + 'px';

    assign(this.node.style, DEFAULT_STYLE, style);
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
    }

    // content editable elements
    else if ('contentEditable' in focusEl) {
      setRange(focusEl, { start: 100000, end: 100000 });
    }
  }
}

function getTableContainerScroll(node) {
  const tableContainer = domClosest(node, '.tjs-container');

  if (!tableContainer) {
    return {
      scrollTop: 0,
      scrollLeft: 0
    };
  }

  const { scrollLeft, scrollTop } = tableContainer;

  return {
    scrollTop,
    scrollLeft
  };
}