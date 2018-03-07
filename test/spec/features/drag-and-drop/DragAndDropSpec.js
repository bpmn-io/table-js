import {
  domify,
  queryAll as domQueryAll
} from 'min-dom';

import TestContainer from 'mocha-test-container-support';

/* global sinon */

import { bootstrap, inject } from 'test/TestHelper';

import DragAndDropModule from 'lib/features/drag-and-drop';
import ModelingModule from 'lib/features/modeling';

function triggerEvent(element, type, data = {}) {
  const event = document.createEvent('Event');

  event.initEvent(type, true, true);

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      event[key] = data[key];
    }
  }

  element.dispatchEvent(event);

  return event;
}


describe('DragAndDrop', function() {

  let row1, row2, col1, col2;

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  beforeEach(bootstrap({
    modules: [
      DragAndDropModule,
      ModelingModule
    ]
  }));

  beforeEach(inject(function(modeling) {
    row1 = modeling.addRow({ id: 'row1' });
    row2 = modeling.addRow({ id: 'row2' });
    col1 = modeling.addCol({ id: 'col1' });
    col2 = modeling.addCol({ id: 'col2' });
  }));


  describe('events', function() {

    let cell1, cell2;

    beforeEach(inject(function(dragAndDrop) {
      const table = domify(`
        <table>
          <tbody>
            <tr>
              <td draggable="true"></td>
            </tr>
            <tr>
              <td draggable="true"></td>
            </tr>
          </tbody>
        </table>
      `);

      testContainer.appendChild(table);

      const cells = domQueryAll('td', testContainer);

      cell1 = cells[0];
      cell2 = cells[1];

      cell1.addEventListener('dragstart', e => dragAndDrop.startDrag(row1, e));
    }));


    it('should fire #dragStart event', inject(function(dragAndDrop, eventBus) {

      // given
      const spy = sinon.spy();

      eventBus.on('dragAndDrop.dragStart', spy);

      // when
      triggerEvent(cell1, 'dragstart', {
        dataTransfer: {}
      });

      // then
      expect(spy).to.have.been.called;
    }));


    it('should fire #dragOver event', inject(function(dragAndDrop, eventBus) {

      // given
      const dataTransfer = {};

      const spy = sinon.spy();

      eventBus.on('dragAndDrop.dragOver', spy);

      triggerEvent(cell1, 'dragstart', {
        dataTransfer
      });

      // when
      triggerEvent(cell2, 'dragover', {
        dataTransfer
      });

      // then
      expect(spy).to.have.been.called;
    }));


    it('should fire #drop event', inject(function(eventBus) {

      // given
      const dataTransfer = {};

      const spy = sinon.spy();

      eventBus.on('dragAndDrop.drop', spy);

      triggerEvent(cell1, 'dragstart', {
        dataTransfer
      });

      // when
      triggerEvent(cell2, 'drop', {
        dataTransfer
      });

      // then
      expect(spy).to.have.been.called;
    }));


    it('should fire #dragEnd event', inject(function(eventBus) {

      // given
      const dataTransfer = {};

      const spy = sinon.spy();

      eventBus.on('dragAndDrop.dragEnd', spy);

      triggerEvent(cell1, 'dragstart', {
        dataTransfer
      });

      // when
      triggerEvent(document, 'dragend', {
        dataTransfer
      });

      // then
      expect(spy).to.have.been.called;
    }));

  });


  describe('rows', function() {

    let cell1, cell2;

    beforeEach(inject(function(dragAndDrop) {
      const table = domify(`
        <table>
          <tbody>
            <tr>
              <td draggable="true"></td>
            </tr>
            <tr>
              <td draggable="true"></td>
            </tr>
          </tbody>
        </table>
      `);

      testContainer.appendChild(table);

      const cells = domQueryAll('td', testContainer);

      cell1 = cells[0];
      cell2 = cells[1];

      cell1.addEventListener('dragstart', e => dragAndDrop.startDrag(row1, e));
    }));


    function expectRows(expectedRows) {
      const _expectRows = inject(function(sheet) {
        const { rows } = sheet.getRoot();

        rows.forEach((row, index) => {
          expect(row).to.equal(expectedRows[index]);
        });
      });

      _expectRows();
    }


    it('should move row', inject(
      function(elementRegistry, eventBus, sheet) {

        // given
        eventBus.on('dragAndDrop.drop', () => row2);

        // when
        triggerEvent(cell1, 'dragstart', {
          dataTransfer: {}
        });

        triggerEvent(cell2, 'drop');

        // then
        expectRows([
          row2,
          row1
        ]);
      }
    ));


    it('should NOT move row if no target', inject(
      function(elementRegistry, sheet) {

        // when
        triggerEvent(cell1, 'dragstart', {
          dataTransfer: {}
        });

        triggerEvent(cell2, 'drop');

        // then
        expectRows([
          row1,
          row2
        ]);
      }
    ));


    it('should NOT move row if target is same', inject(
      function(elementRegistry, eventBus, sheet) {

        // given
        eventBus.on('dragAndDrop.drop', () => row1);

        // when
        triggerEvent(cell1, 'dragstart', {
          dataTransfer: {}
        });

        triggerEvent(cell2, 'drop');

        // then
        expectRows([
          row1,
          row2
        ]);
      }
    ));

  });


  describe('cols', function() {

    let cell1, cell2;

    beforeEach(inject(function(dragAndDrop) {
      const table = domify(`
        <table>
          <tbody>
            <tr>
              <td draggable="true"></td>
              <td draggable="true"></td>
            </tr>
          </tbody>
        </table>
      `);

      testContainer.appendChild(table);

      const cells = domQueryAll('td', testContainer);

      cell1 = cells[0];
      cell2 = cells[1];

      cell1.addEventListener('dragstart', e => dragAndDrop.startDrag(col1, e));
    }));


    function expectCols(expectedCols) {
      const _expectCols = inject(function(sheet) {
        const { cols } = sheet.getRoot();

        cols.forEach((col, index) => {
          expect(col).to.equal(expectedCols[index]);
        });
      });

      _expectCols();
    }


    it('should move col', inject(
      function(elementRegistry, eventBus, sheet) {

        // given
        eventBus.on('dragAndDrop.drop', () => col2);

        // when
        triggerEvent(cell1, 'dragstart', {
          dataTransfer: {}
        });

        triggerEvent(cell2, 'drop');

        // then
        expectCols([
          col2,
          col1
        ]);
      }
    ));


    it('should NOT move col if no target', inject(
      function(elementRegistry, sheet) {

        // when
        triggerEvent(cell1, 'dragstart', {
          dataTransfer: {}
        });

        triggerEvent(cell2, 'drop');

        // then
        expectCols([
          col1,
          col2
        ]);
      }
    ));


    it('should NOT move col if target is same', inject(
      function(elementRegistry, eventBus, sheet) {

        // given
        eventBus.on('dragAndDrop.drop', () => col1);

        // when
        triggerEvent(cell1, 'dragstart', {
          dataTransfer: {}
        });

        triggerEvent(cell2, 'drop');

        // then
        expectCols([
          col1,
          col2
        ]);
      }
    ));

  });

});