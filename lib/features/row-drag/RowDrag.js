'use strict';

var domify = require('min-dom/lib/domify');
var domClasses = require('min-dom/lib/classes');

var DRAG_THRESHOLD = 10;

function RowDrag(eventBus, sheet, elementRegistry, modeling) {

  this._sheet = sheet;
  this._elementRegistry = elementRegistry;
  this._utilityColumn = null;
  this._modeling = modeling;

  var self = this;

  eventBus.on('utilityColumn.added', function(event) {
    var column = event.column;
    self._utilityColumn = column;
  });

  this.dragDistance = 0;
  this.draggedElement = null;
  this.previousCoordinates = {
    x: 0,
    y: 0
  };
  this.highlightedBorder = null;
  this.moveAbove = false;

  eventBus.on('element.mousedown', function(event) {
    if(event.element.column === self._utilityColumn) {
      event.preventDefault();
      self.startDragging(event.element.row);
      self.setLastDragPoint(event.originalEvent);
    }
  });
  document.body.addEventListener('mouseup', function(event) {
    if(self.isDragging()) {
      self.stopDragging();
    }
  });
  document.body.addEventListener('mousemove', function(event) {
    if(self.isDragging()) {
      event.preventDefault();
      self.updateDragDistance(event);
      if(self.dragDistance > DRAG_THRESHOLD) {
        self.updateVisuals(event);
      }
    }
  });
}

RowDrag.$inject = [ 'eventBus', 'sheet', 'elementRegistry', 'modeling' ];

module.exports = RowDrag;

RowDrag.prototype.setLastDragPoint = function(event) {
  this.previousCoordinates.x = event.clientX;
  this.previousCoordinates.y = event.clientY;
};

RowDrag.prototype.updateVisuals = function(event) {

  if(!this.dragVisual) {
    this.dragVisual = this.createDragVisual(this.draggedElement);
  }

  var container = this._sheet.getContainer();
  container.appendChild(this.dragVisual);

  this.dragVisual.style.position = 'fixed';
  this.dragVisual.style.left = (this.previousCoordinates.x + 5) + 'px';
  this.dragVisual.style.top = (this.previousCoordinates.y + 5) + 'px';

  // clear the indicator for the previous run
  if(this.highlightedBorder) {
    domClasses(this.highlightedBorder).remove('drop');
    domClasses(this.highlightedBorder).remove('above');
    domClasses(this.highlightedBorder).remove('below');
    this.highlightedBorder = null;
  }

  // get the element we are hovering over
  var tr = event.target;
  while(tr && (tr.tagName || '').toLowerCase() !== 'tr') {
    tr = tr.parentNode;
  }
  if(tr) {
    // tr must be child of tbody
    if(this._sheet.getBody().contains(tr)) {
      // check if we hover over the top or the bottom half of the row
      var e = tr;
      var offset = {x:0,y:0};
      while (e)
      {
          offset.x += e.offsetLeft;
          offset.y += e.offsetTop;
          e = e.offsetParent;
      }
      if(event.clientY < offset.y + tr.clientHeight / 2) {
        domClasses(tr).add('drop');
        domClasses(tr).add('above');
        this.moveAbove = true;
      } else {
        domClasses(tr).add('drop');
        domClasses(tr).add('below');
        this.moveAbove = false;
      }
      this.highlightedBorder = tr;
    }
  }
};

RowDrag.prototype.updateDragDistance = function(event) {
  this.dragDistance +=
      Math.abs(event.clientX - this.previousCoordinates.x) +
      Math.abs(event.clientY - this.previousCoordinates.y);

  this.setLastDragPoint(event);
};

RowDrag.prototype.startDragging = function(element) {
  this.draggedElement = element;
  this.dragDistance = 0;

  this.dragVisual = null;
};

RowDrag.prototype.createDragVisual = function(element) {
  // get the html representation of the row
  var gfx = this._elementRegistry.getGraphics(element);

  // create a clone
  var clone = gfx.cloneNode(true);

  // fix the line number field width
  clone.firstChild.setAttribute('class', 'hit number');

  // put it in a table tbody
  var table = domify('<table><tbody></tbody></table>');
  table.setAttribute('class','dragTable');
  table.firstChild.appendChild(clone);

  // fade the original element
  domClasses(gfx).add('dragged');

  return table;
};

RowDrag.prototype.stopDragging = function() {
  if(this.highlightedBorder) {
    // make sure we drop it to the element we have previously highlighted
    var targetElement = this._elementRegistry.get(this.highlightedBorder.getAttribute('data-element-id'));
    this._modeling.moveRow(this.draggedElement, targetElement, this.moveAbove);
  }
  if(this.dragVisual) {
    this.dragVisual.parentNode.removeChild(this.dragVisual);
    // restore opacity of the element
    domClasses(this._elementRegistry.getGraphics(this.draggedElement)).remove('dragged');
    this._elementRegistry.getGraphics(this.draggedElement).style.opacity = '';
  }
  if(this.highlightedBorder) {
    domClasses(this.highlightedBorder).remove('drop');
    domClasses(this.highlightedBorder).remove('above');
    domClasses(this.highlightedBorder).remove('below');
    this.highlightedBorder = null;
  }

  this.draggedElement = null;
};

RowDrag.prototype.isDragging = function() {
  return !!this.draggedElement;
};
