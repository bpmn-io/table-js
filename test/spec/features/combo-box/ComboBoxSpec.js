'use strict';

var TestContainer = require('mocha-test-container-support');

var ComboBox = require('../../../../lib/features/combo-box');

// initiate browser events
// http://stackoverflow.com/a/2706236
function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

describe.only('features/combo-box', function() {

  var testContainer;
  beforeEach(function() {
    // Make sure the test container is an optional dependency and we fall back
    // to an empty <div> if it does not exist.
    //
    // This is needed if other libraries rely on this helper for testing
    // while not adding the mocha-test-container-support as a dependency.
    try {
      testContainer = TestContainer.get(this);
    } catch (e) {
      testContainer = document.createElement('div');
      document.body.appendChild(testContainer);
    }

    testContainer.classList.add('test-container');
  });

  it('should apply the value on click on the dropdown option', function() {

    // given
    var comboBox = new ComboBox({
      options: ['option']
    });

    testContainer.appendChild(comboBox.getNode());

    comboBox._openDropdown();

    // when
    var elem = document.body.querySelector('ul li');

    eventFire(elem, 'click');

    // then
    expect(comboBox.getValue()).to.eql('option');

  });
});
