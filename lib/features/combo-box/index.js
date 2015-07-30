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
 * @param {String[]} classNames
 * @param {String[]} options
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

  forEach(dropdownClassNames, function(className) {
    domClasses(self._dropdown).add(className);
  });
  forEach(options, function(option) {
    var node = document.createElement('li');
    node.setAttribute('tabindex', '1');
    node.textContent = option;
    self._dropdown.appendChild(node);
  });

  forEach(classNames, function(className) {
    domClasses(template).add(className);
  });

  template.querySelector('label').textContent = label + ':';

  template.querySelector('span').addEventListener('click', function(evt) {
    self._toggleDropdown(options);
    evt.stopPropagation();
  });

  // --- event listeners ---
  document.body.addEventListener('click', function() {
    self._closeDropdown();
  });

  this._dropdown.addEventListener('click', function(evt) {
    self._template.querySelector('input').value = evt.target.innerText;
  });

  this._template.querySelector('input').addEventListener('input', function(evt) {
    var filteredList = options.filter(function(option) {
      return option.toLowerCase().indexOf(self._template.querySelector('input').value.toLowerCase()) !== -1;
    });
    self._openDropdown(filteredList);
  });

  return template;

}

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

ComboBox.prototype._openDropdown = function(options) {

  if(options.length === 0) {
    this._closeDropdown();
    return;
  }

  forEach(this._dropdown.childNodes, function(child) {
    if(options.indexOf(child.textContent) !== -1) {
      child.style.display = 'block';
    } else {
      child.style.display = 'none';
    }
  });

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


module.exports = ComboBox;
