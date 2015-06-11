'use strict';

/**
 * The default renderer used for shapes and connections.
 *
 */
function Renderer() {
}

module.exports = Renderer;

Renderer.prototype.drawRow = function drawRow(gfx, data) {
  return gfx;
};

Renderer.prototype.drawColumn = function drawColumn(gfx, data) {
  return gfx;
};

Renderer.prototype.drawCell = function drawCell(gfx, data) {
  gfx.textContent = data.content;
  return gfx;
};
