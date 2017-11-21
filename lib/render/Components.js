import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';

const DEFAULT_PRIORITY = 1000;


export default class Components {
  
  constructor() {
    this._listeners = {};
  }
  
  getComponent(type, context) {    
    const listeners = this._listeners[type];
    
    if (!listeners) {
      return;
    }

    let component;

    for (let i = 0; i < listeners.length; i++) {
      component = listeners[i].callback(context);

      if (component) {
        break;
      }
    }

    return component;
  }
  
  getComponents(type, context) {
    const listeners = this._listeners[type];
    
    if (!listeners) {
      return;
    }
    
    const components = [];

    for (let i = 0; i < listeners.length; i++) {
      const component = listeners[i].callback(context);

      if (component) {
        components.push(component);
      }
    }
    
    if (!components.length) {
      return;
    }

    return components;
  }
  
  onGetComponent(type, priority, callback) {
    if (isFunction(priority)) {
      callback = priority;
      priority = DEFAULT_PRIORITY;
    }
  
    if (!isNumber(priority)) {
      throw new Error('priority must be a number');
    }

    this._addListener(type, { priority: priority, callback: callback });
  }
  
  _addListener(type, newListener) {
    const listeners = this._getListeners(type);
  
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
  
  _getListeners(type) {
    let listeners = this._listeners[type];

    if (!listeners) {
      this._listeners[type] = listeners = [];
    }

    return listeners;
  }
}