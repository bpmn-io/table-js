import { bootstrap, inject } from 'test/TestHelper';

/* global sinon */

describe('ChangeSupport', function() {

  beforeEach(bootstrap());


  it('should add listener', inject(function(changeSupport) {
    
    // given
    const listener = () => {};

    // when
    changeSupport.onElementsChanged('foo', listener);

    // then
    expect(changeSupport._listeners).to.eql({
      foo: [
        listener
      ]
    });
  }));


  it('should remove listener', inject(function(changeSupport) {
    // given
    const listener = () => {};

    changeSupport.onElementsChanged('foo', listener);
    
    // when
    changeSupport.offElementsChanged('foo', listener);

    // then
    expect(changeSupport._listeners).to.eql({
      foo: []
    });
  }));


  it('should remove all listeners', inject(function(changeSupport) {
    // given
    changeSupport.onElementsChanged('foo', () => {});
    changeSupport.onElementsChanged('foo', () => {});
    
    // when
    changeSupport.offElementsChanged('foo');

    // then
    expect(changeSupport._listeners).to.eql({
      foo: []
    });
  }));


  describe('elements change', function() {

    let spy;

    beforeEach(inject(function(changeSupport) {
      spy = sinon.spy();

      changeSupport.onElementsChanged('foo', spy);
    }));


    it('should call listener', inject(function(eventBus) {

      // when
      eventBus.fire('elements.changed', {
        elements: [{
          id: 'foo'
        }]
      });

      // then
      expect(spy).to.have.been.called;
    }));


    it('should not call listener', inject(function(eventBus) {
      
      // when
      eventBus.fire('elements.changed', {
        elements: [{
          id: 'bar'
        }]
      });

      // then
      expect(spy).to.not.have.been.called;
    }));

  });


  describe('root element change', function() {

    let spy;
    
    beforeEach(inject(function(changeSupport, sheet) {
      spy = sinon.spy();

      sheet.setRoot({
        id: 'foo'
      });

      changeSupport.onElementsChanged('foo', spy);
    }));


    it('should update on root change', inject(function(sheet, eventBus) {
      
      // when
      const root = {
        id: 'bar'
      };
      
      sheet.setRoot(root);

      eventBus.fire('elements.changed', {
        elements: [ root ]
      });

      // then
      expect(spy).to.have.been.called;
    }));

  });

});