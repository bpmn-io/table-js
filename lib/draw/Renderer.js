'use strict';

/**
 * The default renderer used for shapes and connections.
 *
 */
function Renderer() {
}

module.exports = Renderer;

Renderer.prototype.drawRow = function drawShape(gfx, data) {
  return gfx;
};

Renderer.prototype.drawColumn = function drawShape(gfx, data) {
  return gfx;
};

Renderer.prototype.drawCell = function drawShape(gfx, data) {
  gfx.textContent = data.content;
  return gfx;
};
