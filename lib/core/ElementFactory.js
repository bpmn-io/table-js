'use strict';

var Model = require('../model');


/**
 * A factory for diagram-js shapes
 */
function ElementFactory() {
  this._uid = 12;
}

module.exports = ElementFactory;


ElementFactory.prototype.createTable = function(attrs) {
  return document.createElement('table');
  //return this.create('table', attrs);
};

ElementFactory.prototype.createRow = function(attrs) {
  return this.create('row', attrs);
};

ElementFactory.prototype.createColumn = function(attrs) {
  return this.create('column', attrs);
};

/**
 * Create a model element with the given type and
 * a number of pre-set attributes.
 *
 * @param  {String} type
 * @param  {Object} attrs
 * @return {djs.model.Base} the newly created model instance
 */
ElementFactory.prototype.create = function(type, attrs) {

  attrs = attrs || {};

  if (!attrs.id) {
    attrs.id = type + '_' + (this._uid++);
  }

  return Model.create(type, attrs);
};
