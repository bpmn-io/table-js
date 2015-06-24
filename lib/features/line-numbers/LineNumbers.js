'use strict';

function LineNumbers(eventBus, sheet, rules) {

  this.lineNumberColumn;
  var self = this;
  eventBus.on('sheet.init', function(event) {
    // add column for line numbers
    self.lineNumberColumn = sheet.addColumn({id: 'lineNumbers'});
  });

  eventBus.on('cells.added', function(row) {
    if(row._type === 'row') {
      if(row.isHead || row.isFoot) {
        sheet.setCellContent({
          row: row,
          column: self.lineNumberColumn,
          content: ''
        });
        return;
      }
      // find the first row
      var currentRow = row;
      while(currentRow.previous) {
        currentRow = currentRow.previous;
      }

      // update the row number for all rows
      var i = 1;
      while(currentRow) {
        sheet.setCellContent({
          row: currentRow,
          column: self.lineNumberColumn,
          content: i
        });
        i++;
        currentRow = currentRow.next;
      }
    }
  });

}


LineNumbers.$inject = [ 'eventBus', 'sheet', 'rules' ];

module.exports = LineNumbers;
