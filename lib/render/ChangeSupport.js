export default class ChangeSupport {
  constructor(eventBus) {    
    this._listeners = {};

    eventBus.on('elements.changed', ({ elements }) => {
      this.elementsChanged(elements);
    });
  }
  
  elementsChanged(elements) {
    const invoked = {};
    
    const elementsLength = elements.length;

    for (let i = 0; i < elementsLength; i++) {
      const { id } = elements[i];
      
      if (invoked[id]) {
        return;
      }
      
      invoked[id] = true;
      
      const listenersLength = this._listeners[id] && this._listeners[id].length;
      
      if (listenersLength) {
        for (let j = 0; j < listenersLength; j++) {
          this._listeners[id][j]();
        }
      }
    }
  }
  
  onElementsChanged(id, listener) {
    if (!this._listeners[id]) {
      this._listeners[id] = [];
    }
    
    // avoid push for better performance
    this._listeners[id][this._listeners[id].length] = listener;
  }
  
  offElementsChanged(id, listener) {
    if (!this._listeners[id]) {
      return;
    }
    
    const idx = this._listeners[id].indexOf(listener);
    
    if (idx !== -1) {
      this._listeners[id].splice(idx, 1);
    }
  }
}

ChangeSupport.$inject = [ 'eventBus' ];