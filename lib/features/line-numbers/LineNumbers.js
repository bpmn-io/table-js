'use strict';

function LineNumbers(eventBus, sheet) {

  this._sheet = sheet;
  this._utilityColumn = null;

  var self = this;

  eventBus.on('utilityColumn.added', function(column) {
    self._utilityColumn = column;
    self.updateLineNumbers();
  });

  eventBus.on('cells.added', this.updateLineNumbers.bind(this));
}


LineNumbers.$inject = [ 'eventBus', 'sheet' ];

module.exports = LineNumbers;

LineNumbers.prototype.updateLineNumbers = function() {
  if(!this._utilityColumn || !this._sheet._lastRow) {
    // only render line numbers if utility column has been added
    return;
  }

  // find the first row
  var currentRow = this._sheet._lastRow;
  while(currentRow.previous) {
    currentRow = currentRow.previous;
  }

  // update the row number for all rows
  var i = 1;
  while(currentRow) {
    this._sheet.setCellContent({
      row: currentRow,
      column: this._utilityColumn,
      content: i
    });
    i++;
    currentRow = currentRow.next;
  }
};
