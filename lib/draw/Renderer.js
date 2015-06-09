'use strict';

/**
 * The default renderer used for shapes and connections.
 *
 * @param {Styles} styles
 */
function Renderer(styles) {
  this.CONNECTION_STYLE = styles.style([ 'no-fill' ], { strokeWidth: 5, stroke: 'fuchsia' });
  this.SHAPE_STYLE = styles.style({ fill: 'white', stroke: 'fuchsia', strokeWidth: 2 });
}

module.exports = Renderer;

Renderer.$inject = ['styles'];


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
