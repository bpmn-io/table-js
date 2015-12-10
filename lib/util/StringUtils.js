'use strict';

function calculateSelectionUpdate(selection, currentValue, newValue) {

  currentValue = currentValue || '';
  newValue = newValue || '';

  var newSelection = selection.start,
      diff = newValue.length - currentValue.length,
      idx,
      broken = false;

  if(currentValue === newValue.substr(0, currentValue.length)) {
    return range(newValue.length);
  }

  for (idx = newValue.length; idx >= diff; idx--) {
    if (currentValue.charAt(idx - diff) !== newValue.charAt(idx)) {

      newSelection = idx + 1;
      broken = true;
      break;
    }
  }
  if(!broken) {
    newSelection = newValue.length;
  }

  return range(newSelection);
}

module.exports.calculateSelectionUpdate = calculateSelectionUpdate;


function range(start, end) {
  return {
    start: start,
    end: end === undefined ? start : end
  };
}
