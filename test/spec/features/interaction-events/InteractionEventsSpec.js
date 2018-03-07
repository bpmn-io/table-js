import {
  queryAll as domQueryAll
} from 'min-dom';

/* global sinon */

import { inject, bootstrap } from 'test/TestHelper';

import TestContainer from 'mocha-test-container-support';

import InterActionEventsModule from 'lib/features/interaction-events';

function triggerMouseEvent(node, event, clientX = 0, clientY = 0) {
  const e = document.createEvent('MouseEvent');

  if (e.initMouseEvent) {
    e.initMouseEvent(
      event, true, true, window,
      0, 0, 0, clientX, clientY,
      false, false, false, false, 0, null
    );
  }

  node.dispatchEvent(e);
}


describe('InteractionEvents', function() {

  let nodeWithElementId,
      nodeWithoutElementId;

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  beforeEach(bootstrap({
    modules: [ InterActionEventsModule ]
  }));

  beforeEach(inject(function(components, eventBus, sheet) {
    components.onGetComponent('table.body', () => () => (
      <tbody>
        <tr>
          <td></td>
          <td data-element-id="cell"></td>
        </tr>
      </tbody>
    ));

    eventBus.fire('elements.changed', { elements: [ sheet.getRoot() ] });


    const cells = domQueryAll('td', testContainer);

    nodeWithoutElementId = cells[0];
    nodeWithElementId = cells[1];
  }));

  function expectInteractionEvent(event) {
    return inject(function(eventBus) {
      const spy = sinon.spy();

      eventBus.on(`cell.${event}`, spy);

      // when
      triggerMouseEvent(nodeWithElementId, event);

      // then
      expect(spy).to.have.been.called;
    });
  }

  function expectNoInteractionEvent(event) {
    return inject(function(eventBus) {
      const spy = sinon.spy();

      eventBus.on(`cell.${event}`, spy);

      // when
      triggerMouseEvent(nodeWithoutElementId, event);

      // then
      expect(spy).to.not.have.been.called;
    });
  }


  it('should fire cell.click', expectInteractionEvent('click'));


  it('should not fire cell.click', expectNoInteractionEvent('click'));


  it('should fire cell.dblclick', expectInteractionEvent('dblclick'));


  it('should not fire cell.dblclick', expectNoInteractionEvent('dblclick'));


  it('should fire cell.contextmenu', expectInteractionEvent('contextmenu'));


  it('should not fire cell.contextmenu', expectNoInteractionEvent('contextmenu'));


  it('should fire cell.mousedown', expectInteractionEvent('mousedown'));


  it('should not fire cell.mousedown', expectNoInteractionEvent('mousedown'));


  it('should fire cell.mouseup', expectInteractionEvent('mouseup'));


  it('should not fire cell.mouseup', expectNoInteractionEvent('mouseup'));

});