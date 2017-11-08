import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';

const DEFAULT_PRIORITY = 1000;


export default class Components {
  
  constructor() {
    this._onGetComponentListeners = {};
    this._postGetComponentListeners = {};
  }
  
  getComponent(type, context) {    
    const onGetComponentListeners = this._onGetComponentListeners[type];
    
    if (!onGetComponentListeners) {
      return;
    }
    
    const onGetComponentListener = onGetComponentListeners[0];
    
    const component = onGetComponentListener.callback(context);
    
    if (!component) {
      return;
    }
    
    const postGetComponentListeners = this._postGetComponentListeners[type];
    
    if (!postGetComponentListeners) {
      return component;
    }
    
    return postGetComponentListeners.reduce((c, l) => {
      return l.callback(c, context);
    }, component);
  }
  
  getComponents(type, context) {
    const onGetComponentListeners = this._onGetComponentListeners[type];
    
    if (!onGetComponentListeners) {
      return;
    }
    
    const components = onGetComponentListeners.map(onGetComponentListener => {
      return onGetComponentListener.callback(context);
    });
    
    if (!components.length) {
      return;
    }
    
    const postGetComponentListeners = this._postGetComponentListeners[type];
    
    if (!postGetComponentListeners) {
      return components;
    }
    
    return components.map(component => {
      return postGetComponentListeners.reduce((c, l) => {
        return l.callback(c, context);
      }, component);
    });
  }
  
  onGetComponent(type, priority, callback) {
    if (isFunction(priority)) {
      callback = priority;
      priority = DEFAULT_PRIORITY;
    }
  
    if (!isNumber(priority)) {
      throw new Error('priority must be a number');
    }

    this._addListener(type, { priority: priority, callback: callback }, this._onGetComponentListeners);
  }
  
  postGetComponent(type, priority, callback) {
    if (isFunction(priority)) {
      callback = priority;
      priority = DEFAULT_PRIORITY;
    }
  
    if (!isNumber(priority)) {
      throw new Error('priority must be a number');
    }

    this._addListener(type, { priority: priority, callback: callback }, this._postGetComponentListeners);
  }
  
  _addListener(type, newListener, listenersMap) {
    const listeners = this._getListeners(type, listenersMap);
  
    let existingListener,
        idx;

    for (idx = 0; (existingListener = listeners[idx]); idx++) {
      if (existingListener.priority < newListener.priority) {

        // prepend newListener at before existingListener
        listeners.splice(idx, 0, newListener);
        return;
      }
    }

    listeners.push(newListener);
  }
  
  _getListeners(type, listenersMap) {
    var listeners = listenersMap[type];

    if (!listeners) {
      listenersMap[type] = listeners = [];
    }

    return listeners;
  }
}