'use strict';

var forEach = require('lodash/collection/forEach'),
    assign = require('lodash/object/assign'),
    domDelegate = require('min-dom/lib/delegate'),
    domify = require('min-dom/lib/domify'),
    domClasses = require('min-dom/lib/classes'),
    domAttr = require('min-dom/lib/attr'),
    domRemove = require('min-dom/lib/remove');


var DATA_REF = 'data-id';

/**
 * A popup menu that can be used to display a list of actions.
 *
 * {@link PopupMenu#open} is used to create and open the popup menu.
 * With {@link PopupMenu#update} it is possible to update certain entries in the popup menu
 * (see examples below).
 *
 * @example
 *
 * // create a basic popup menu
 * popupMenu.open(
 *   {
 *     position: { x: 100, y: 100 },
 *     entries: [
 *       {
 *         id: 'entry-1',
 *         label: 'Entry 1',
 *         action: function(event, entry) {
 *           // do some stuff
 *         }
 *       },
 *       {
 *         id: 'entry-2',
 *         label: 'Entry 2'
 *       }
 *     ]
 *   }
 * );
 *
 * // create a more complex popup menu
 * popupMenu.open({
 *   position: { x: 100, y: 100 },
 *   entries: [
 *     {
 *       id: 'entry-1',
 *       label: 'Entry 1',
 *       action: function(event, entry) {
 *         if (entry.active) {
 *           // Removes the HTML class 'active' from the entry div, if it is clicked.
 *           popupMenu.update(entry, { active: false });
 *         } else {
*           // Adds the HTML class 'active' from the entry div, if it is clicked.
 *           popupMenu.update(entry, { active: true });
 *         }
 *       }
 *     }
 *   ]
 * });
 *
 * // With popupMenu.update() it is possbile to update a certain entry by id.
 * // This functionality can be used to add the HTML classes 'active' or
 * // 'disabled' to a certain entry div element. This can be useful in action
 * // handler functions (see complex example above).
 * popupMenu.update('header-entry-a', { active: true });
 * popupMenu.update('header-entry-a', { disabled: true });
 *
 * // It is also possible to remove these classes:
 * popupMenu.update('header-entry-a', { active: false });
 * popupMenu.update('header-entry-a', { disabled: false });
 *
 *
 * @param {EventBus} eventBus
 * @param {Sheet} sheet
 *
 * @class
 * @constructor
 */
function PopupMenu(eventBus, sheet) {

  this._eventBus = eventBus;
  this._sheet  = sheet;
}

PopupMenu.$inject = [ 'eventBus', 'sheet' ];


/**
 * Creates the popup menu, adds entries and attaches it to the DOM.
 *
 * @param {Object} menu
 * @param {Object} menu.position
 * @param {String} [menu.className] a custom HTML class name for the popup menu
 *
 * @param {Array.<Object>} menu.entries
 * @param {String} menu.entries[].id
 * @param {String} menu.entries[].content Either an embedded entries array or an object describing the entry
 * @param {String} menu.entries[].content.label
 * @param {String} [menu.entries[].content.className] a custom HTML class name for the entry div element
 * @param {Object} [menu.entries[].content.action] a handler function that will be called on a click on the entry
 *
 * @return {PopupMenu}
 */
PopupMenu.prototype.open = function(menu) {

  var className = menu.className || 'popup-menu',
      position = menu.position,
      entries = menu.entries;

  if (!position) {
    throw new Error('the position argument is missing');
  }

  if (!entries) {
    throw new Error('the entries argument is missing');
  }

  // make sure, only one popup menu is open at a time
  if (this.isOpen()) {
    this.close();
  }

  var sheet = this._sheet,
      parent = document.body, //sheet.getContainer(),
      container = this._createContainer(className, position);

  this._createEntries(entries, container);

  this._attachContainer(container, parent);

  this._current = {
    container: container,
    menu: menu
  };

  return this;
};


/**
 * Removes the popup menu and unbinds the event handlers.
 */
PopupMenu.prototype.close = function() {

  if (!this.isOpen()) {
    return;
  }

  this._unbindHandlers();
  domRemove(this._current.container);
  this._current = null;
};


/**
 * Determines, if an open popup menu exist.
 * @return {Boolean}
 */
PopupMenu.prototype.isOpen = function() {
  return !!this._current;
};


/**
 * Trigger an action associated with an entry.
 *
 * @param {Object} event
 */
PopupMenu.prototype.trigger = function(event) {

  // silence other actions
  event.preventDefault();

  var element = event.delegateTarget || event.target,
      entryId = domAttr(element, DATA_REF);

  var entry = this._getEntry(entryId);

  if (entry.action) {
    return entry.action.call(null, event, entry);
  }
};


/**
 * Updates the attributes of an entry instance.
 *
 * The properties `active` and `disabled` will be added to entries as class names.
 * This allows for state specific styling.
 *
 * @example
 *
 * popupMenu.update('header-entry-a', { active: true });
 * popupMenu.update('header-entry-a', { disabled: true });
 *
 * @param  {String|Object} entry the id of an entry or the entry instance itself
 * @param  {Object} updatedAttrs an object with the attributes that will be updated
 */
PopupMenu.prototype.update = function(entry, updatedAttrs) {

  if (typeof entry === 'string') {
    entry = this._getEntry(entry);
  }

  assign(entry, updatedAttrs);

  // redraw the menu by reopening it
  this.open(this._current.menu);
};


/**
 * Gets an entry instance (either entry or headerEntry) by id.
 *
 * @param  {String} entryId
 *
 * @return {Object} entry instance
 */
PopupMenu.prototype._getEntry = function(entryId) {

  var menu = this._current.menu;

  var searchFct = function(haystack, needle) {
    for(var i = 0; i < haystack.length; i++) {
      if(haystack[i].id === needle) {
        return haystack[i];
      }
      if(haystack[i].content.entries) {
        var found = searchFct(haystack[i].content.entries, needle);
        if(found) {
          return found;
        }
      }
    }
  };
  var entry = searchFct(menu.entries, entryId);

  if (!entry) {
    throw new Error('entry not found');
  }

  return entry;
};


/**
 * Creates the popup menu container.
 *
 * @param {String} event
 * @param {Object} position
 */
PopupMenu.prototype._createContainer = function(className, position) {
  var container = domify('<nav class="dmn-context-menu">');

  assign(container.style, {
    position: 'absolute',
    left: position.x + 'px',
    top: position.y  + 'px'
  });

  domClasses(container).add(className);

  return container;
};


/**
 * Attaches the container to the DOM and binds the event handlers.
 *
 * @param {Object} container
 * @param {Object} parent
 */
PopupMenu.prototype._attachContainer = function(container, parent) {
  var self = this;

   // Event handler
  domDelegate.bind(container, '.entry' ,'click', function(event) {
    self.trigger(event);
  });

  // Prevent default for mousedown events (so that selection does not get lost)
  domDelegate.bind(container, '.entry' ,'mousedown', function(event) {
    event.preventDefault();
  });
  // Attach to DOM
  parent.appendChild(container);

  // Add Handler
  this._bindHandlers();
};


/**
 * Creates and attaches entries to the popup menu.
 *
 * @param {Array<Object>} entries an array of entry objects
 * @param {Object} container the parent DOM container
 * @param {String} className the class name of the entry container
 */
PopupMenu.prototype._createEntries = function(entries, container) {

  var entriesContainer = domify('<ul>'),
      self = this;

  forEach(entries, function(entry) {
    self._createEntry(entry, entriesContainer);
  });

  domClasses(entriesContainer).add('dropdown-menu');

  container.appendChild(entriesContainer);
};


/**
 * Creates a single entry and attaches it to the specified DOM container.
 *
 * @param  {Object} entry
 * @param  {Object} container
 */
PopupMenu.prototype._createEntry = function(entry, container) {

    if (!entry.id) {
      throw new Error ('every entry must have the id property set');
    }

    var entryContainer = domify('<li>'),
        entryClasses = domClasses(entryContainer),
        link = domify('<a>'),
        linkClasses = domClasses(link);

    entryContainer.appendChild(link);

    entryClasses.add('entry');

    if (entry.content.className) {
      entryClasses.add(entry.content.className);
    }
    if (entry.content.linkClass) {
      linkClasses.add(entry.content.linkClass);
    }

    domAttr(entryContainer, DATA_REF, entry.id);

    // icon
    var icon = domify('<span>'),
        iconClasses = domClasses(icon);

    iconClasses.add('icon');
    if(entry.content.icon) {
      iconClasses.add(entry.content.icon);
    }
    link.appendChild(icon);

    // label
    var label = domify('<span>'),
        labelClasses = domClasses(label);
    labelClasses.add('label');
    link.appendChild(label);


    if(entry.content.entries) {
      // create a nested menu
      label.textContent = entry.content.label;
      entryClasses.add('dropdown');
      this._createEntries(entry.content.entries, entryContainer);
    } else {
      // create a normal entry
      if (entry.content.label) {
        label.textContent = entry.content.label;
      }

      if (entry.content.imageUrl) {
        entryContainer.appendChild(domify('<img src="' + entry.content.imageUrl + '" />'));
      }

      if (entry.content.active === true) {
        entryClasses.add('active');
      }

      if (entry.content.disabled === true) {
        entryClasses.add('disabled');
      }

    }

    container.appendChild(entryContainer);
};


/**
 * Binds the `close` method to 'contextPad.close' & 'canvas.viewbox.changed'.
 */
PopupMenu.prototype._bindHandlers = function() {
/*
  var eventBus = this._eventBus,
      self = this;

  function close() {
    self.close();
  }

  eventBus.once('contextPad.close', close);
  eventBus.once('canvas.viewbox.changed', close);
*/
};


/**
 * Unbinds the `close` method to 'contextPad.close' & 'canvas.viewbox.changed'.
 */
PopupMenu.prototype._unbindHandlers = function() {
/*
  var eventBus = this._eventBus,
      self = this;

  function close() {
    self.close();
  }

  eventBus.off('contextPad.close', close);
  eventBus.off('canvas.viewbox.changed', close);
*/
};

module.exports = PopupMenu;
