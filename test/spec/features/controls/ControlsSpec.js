'use strict';

require('../../../TestHelper');

var DOMEvents = require('../../../util/DOMEvents');
/* global bootstrapTable, inject */


var controlsModule = require('../../../../lib/features/controls');


describe('features/controls', function() {

  beforeEach(bootstrapTable({ modules: [ controlsModule ] }));

  it('should bootstrap diagram with component', inject(function() {}));

  it('should add control container upon initialization', inject(function(controls, sheet) {
    expect(sheet.getRootElement().parentNode.contains(controls.controlsContainer)).to.be.true;
  }));

  it('should add control with label', inject(function(controls) {
    controls.addControl('Test Control', function() {});

    expect(controls.controlsContainer.firstChild.textContent).to.eql('Test Control');
  }));

  it('should fire provided function on click', inject(function(controls) {

    var fctCalled = false;

    controls.addControl('Test Control', function() {
      fctCalled = true;
    });

    DOMEvents.performMouseEvent('click', controls.controlsContainer.firstChild);

    expect(fctCalled).to.eql(true);
  }));

});
