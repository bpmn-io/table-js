'use strict';

var debounce = require('lodash/function/debounce');

function LineNumbers(eventBus, sheet) {

  this._sheet = sheet;
  this._utilityColumn = null;

  var self = this;

  eventBus.on('utilityColumn.added', function(event) {
    var column = event.column;
    self._utilityColumn = column;
    self.updateLineNumbers();
  });
  eventBus.on([ 'cells.added', 'row.removed' ], debounce(self.updateLineNumbers.bind(self), 100, {
    'leading': true,
    'trailing': true
  }));
}


LineNumbers.$inject = [ 'eventBus', 'sheet' ];

module.exports = LineNumbers;

LineNumbers.prototype.updateLineNumbers = function() {
  if (!this._utilityColumn || !this._sheet.getLastRow('body')) {
    // only render line numbers if utility column has been added
    return;
  }

  // find the first row
  var currentRow = this._sheet.getLastRow('body');
  while (currentRow.previous) {
    currentRow = currentRow.previous;
  }

  // update the row number for all rows
  var i = 1;
  while (currentRow) {
    this._sheet.setCellContent({
      row: currentRow,
      column: this._utilityColumn,
      content: i
    });
    i++;
    currentRow = currentRow.next;
  }
};
