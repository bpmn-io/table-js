'use strict';

var forEach = require('lodash/collection/forEach');

var NOT_REGISTERED_ERROR = 'is not a registered action',
    IS_REGISTERED_ERROR = 'is already registered';

/**
 * An interface that provides access to modeling actions by decoupling
 * the one who requests the action to be triggered and the trigger itself.
 *
 * It's possible to add new actions by registering them with ´registerAction´ and likewise
 * unregister existing ones with ´unregisterAction´.
 *
 */
function EditorActions(commandStack) {

  this._actions = {
    undo: function() {
      commandStack.undo();
    },
    redo: function() {
      commandStack.redo();
    }
  };
}

EditorActions.$inject = [ 'commandStack' ];

module.exports = EditorActions;


/**
 * Triggers a registered action
 *
 * @param  {String} action
 * @param  {Object} opts
 *
 * @return {Unknown} Returns what the registered listener returns
 */
EditorActions.prototype.trigger = function(action, opts) {
  if (!this._actions[action]) {
    throw error(action, NOT_REGISTERED_ERROR);
  }

  return this._actions[action](opts);
};


/**
 * Registers a collections of actions.
 * The key of the object will be the name of the action.
 *
 * @example
 * ´´´
 * var actions = {
  *    redo: function() {
  *      commandStack.redo();
  *    },
  *    ruleAdd: function() {
  *      var newRow = {id: Id.next()};
  *      modeling.createRow(newRow);
  *    }
  * ];
 * editorActions.register(actions);
 *
 * editorActions.isRegistered('spaceTool'); // true
 * ´´´
 *
 * @param  {Object} actions
 */
EditorActions.prototype.register = function(actions, listener) {
  if (typeof actions === 'string') {
    return this._registerAction(actions, listener);
  }

  forEach(actions, function(listener, action) {
    this._registerAction(action, listener);
  }, this);
};

/**
 * Registers a listener to an action key
 *
 * @param  {String} action
 * @param  {Function} listener
 */
EditorActions.prototype._registerAction = function(action, listener) {
  if (this.isRegistered(action)) {
    throw error(action, IS_REGISTERED_ERROR);
  }

  this._actions[action] = listener;
};

/**
 * Unregister an existing action
 *
 * @param {String} action
 */
EditorActions.prototype.unregister = function(action) {
  if (!this.isRegistered(action)) {
    throw error(action, NOT_REGISTERED_ERROR);
  }

  this._actions[action] = undefined;
};

/**
 * Returns the number of actions that are currently registered
 *
 * @return {Number}
 */
EditorActions.prototype.length = function() {
  return Object.keys(this._actions).length;
};

/**
 * Checks wether the given action is registered
 *
 * @param {String} action
 *
 * @return {Boolean}
 */
EditorActions.prototype.isRegistered = function(action) {
  return !!this._actions[action];
};


function error(action, message) {
  return new Error(action + ' ' + message);
}
