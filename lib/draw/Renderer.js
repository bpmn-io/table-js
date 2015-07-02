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
  gfx.childNodes[0].setAttribute('spellcheck', 'false');
  if(!data.content || !data.content.tagName) {
    gfx.childNodes[0].textContent = data.content;
  } else {
    gfx.childNodes[0].appendChild(data.content);
  }
  return gfx;
};
