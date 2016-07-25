'use strict';

require('../../TestHelper');

/* global bootstrapTable, inject */

var merge = require('lodash/object/merge');
var TestContainer = require('mocha-test-container-support');

describe('GraphicsFactory', function() {

  var container;

  /**
   * Create a diagram with the given options
   */
  function createTable(options) {

    return bootstrapTable(function() {
      return merge({ sheet: { container: container } }, options);
    }, {});
  }

  beforeEach(function() {
    container = TestContainer.get(this);
  });
  beforeEach(createTable());

  it('should not fail on update root shape', inject(function(sheet, graphicsFactory, elementRegistry) {

    // given
    var root = sheet.getRootElement();
    var gfx = elementRegistry.getGraphics(root);

    // when
    graphicsFactory.update('table', root, gfx);

    // then
    // expect not to throw an exception
  }));
});
