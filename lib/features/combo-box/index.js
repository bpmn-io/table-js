'use strict';

var fs = require('fs');

var domify = require('min-dom/lib/domify'),
    domClasses = require('min-dom/lib/classes'),
    assign = require('lodash/object/assign'),
    forEach = require('lodash/collection/forEach');

/**
 * Offers the ability to create a combobox which is a combination of an
 *
 * <ul>
 *   <li>input</li>
 *   <li>dropdown</li>
 *   <li>typeahead</li>
 * </ul>
 *
 * @param {Object}   config
 * @param {String}   config.label
 *                            Text of the label which will be placed before the input field
 * @param {String[]} config.classNames
 *                            Array of Strings each identifying a class name of the comboBox container
 * @param {String[]} config.options
 *                            Array of Strings each specifying one option for the dropdown and typeahead feature
 * @param {String[]} config.dropdownClassNames
 *                            Array of Strings each identifying a class name of the dropdown container
 */
function ComboBox(config) {

  var self = this;
  var template = domify(fs.readFileSync(__dirname + '/ComboBoxTemplate.html', 'utf-8'));

  var label = config.label,
      classNames = config.classNames,
      options = config.options,
      dropdownClassNames = config.dropdownClassNames;

  this._dropdown = document.createElement('ul');
  this._template = template;
  this._dropdownOpen = false;

  // assign classes to the combobox template
  forEach(classNames, function(className) {
    domClasses(template).add(className);
  });

  // assign classes to the dropdown node
  forEach(dropdownClassNames, function(className) {
    domClasses(self._dropdown).add(className);
  });

  // create options
  forEach(options, function(option) {
    var node = document.createElement('li');
    node.setAttribute('tabindex', '1');
    node.textContent = option;
    self._dropdown.appendChild(node);
  });

  // set the label of the combobox
  template.querySelector('label').textContent = label + ':';


  // --- event listeners ---

  // toggles the dropdown on click on the caret symbol
  template.querySelector('span').addEventListener('click', function(evt) {
    self._toggleDropdown(options);
    evt.stopPropagation();
  });

  // closes the dropdown when it is open and the user clicks somewhere
  document.body.addEventListener('click', function() {
    self._closeDropdown();
  });

  // updates the value of the input field when the user
  //   a. clicks on an option in the dropdown
  //   b. focuses an option in the dropdown via keyboard
  var update = function(evt) {
    self.setValue(evt.target.innerText);
  };
  this._dropdown.addEventListener('click', update);
  this._dropdown.addEventListener('focus', update, true);

  // keyboard behavior for dropdown and input field
  var keyboardFunction = function(evt) {
    var code = evt.which || evt.keyCode;

    // ESC
    if(code === 27) {
      self._closeDropdown();
    } else

    // ENTER
    if(code === 13) {
      self._toggleDropdown(options);
    } else

    // TAB, DOWN
    if(code === 9 || code === 40) {
      evt.preventDefault();
      self._focusNext(code === 9 && evt.shiftKey);
    } else

    // UP
    if(code === 38) {
      evt.preventDefault();
      self._focusNext(true);
    }

  };
  this._dropdown.addEventListener('keydown', keyboardFunction);
  this._template.querySelector('input').addEventListener('keydown', keyboardFunction);

  // when typing, show only options that match the typed text
  this._template.querySelector('input').addEventListener('input', function(evt) {
    var filteredList = options.filter(function(option) {
      return option.toLowerCase().indexOf(self._template.querySelector('input').value.toLowerCase()) !== -1;
    });
    self._openDropdown(filteredList);
  });

  return this;
}

/**
 * Focuses the next field in the dropdown. Opens the dropdown if it is closed.
 *
 * @param {boolean} reverse Focus previous field instead of next field
 */
ComboBox.prototype._focusNext = function(reverse) {

  if(!this._isDropdownOpen()) {
    this._openDropdown();
    return;
  }

  var element = document.activeElement;
  var focus;

  // get the element which should have focus
  if(element === this._template.querySelector('input')) {
    focus = this._dropdown[reverse ? 'lastChild' : 'firstChild'];
  } else if (element.parentNode === this._dropdown) {
    focus = element[reverse ? 'previousSibling' : 'nextSibling'];
  }

  // if the element is not displayed (due to text input),
  // select next visible element instead
  while(focus && focus.style.display === 'none') {
    focus = focus[reverse ? 'previousSibling' : 'nextSibling'];
  }

  // if no element can be selected (search reached end of list), focus input field
  if(!focus) {
    focus = this._template.querySelector('input');
  }
  focus.focus();
};

ComboBox.prototype._toggleDropdown = function(options) {
  if(this._isDropdownOpen()) {
    this._closeDropdown();
  } else {
    this._openDropdown(options);
  }
};

ComboBox.prototype._isDropdownOpen = function() {
  return this._dropdownOpen;
};

ComboBox.prototype._closeDropdown = function() {
  if(this._isDropdownOpen()) {
    this._dropdownOpen = false;
    domClasses(this._template).remove('expanded');
    this._dropdown.parentNode.removeChild(this._dropdown);
  }
};

/**
 *  Opens the dropdown menu for the input field.
 *
 *  @param {String[]} options Array of options which should be displayed in the dropdown
 *        If an option was specified in the constructor, but is not included in this list,
 *        it will be hidden via CSS. If the options array is empty, the dropdown is closed.
 */
ComboBox.prototype._openDropdown = function(options) {

  // close dropdown if options array is empty
  if(options && options.length === 0) {
    this._closeDropdown();
    return;
  }

  // update the display of options depending on options array
  forEach(this._dropdown.childNodes, function(child) {
    if(!options || options.indexOf(child.textContent) !== -1) {
      child.style.display = 'block';
    } else {
      child.style.display = 'none';
    }
  });

  // position the dropdown in relation to the position of the input element
  var input = this._template.querySelector('input');
  var e = input;
  var offset = {x:0,y:0};
  while (e)
  {
      offset.x += e.offsetLeft;
      offset.y += e.offsetTop;
      e = e.offsetParent;
  }

  assign(this._dropdown.style, {
    'display': 'block',
    'position': 'absolute',
    'top': (offset.y + input.clientHeight)+'px',
    'left': offset.x+'px',
    'width': input.clientWidth+'px',
  });
  document.body.appendChild(this._dropdown);
  this._dropdownOpen = true;

  domClasses(this._template).add('expanded');

};

ComboBox.prototype.setValue = function(newValue) {
  this._template.querySelector('input').value = newValue;
};

ComboBox.prototype.getValue = function() {
  return this._template.querySelector('input').value;
};

ComboBox.prototype.getNode = function() {
  return this._template;
};

module.exports = ComboBox;
