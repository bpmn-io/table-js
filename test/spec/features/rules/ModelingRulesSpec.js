import { inject, bootstrap } from 'test/TestHelper';

import ModelingModule from 'lib/features/modeling';
import RulesModule from 'lib/features/rules';

import { Row, Col } from 'lib/model';


describe('modeling rules', function() {

  beforeEach(bootstrap({
    modules: [
      ModelingModule,
      RulesModule
    ]
  }));


  it('should allow adding row', expectAllowed('row.add', {
    index: 0
  }));


  it('should NOT allow adding row', expectNotAllowed('row.add', {
    index: 1
  }));


  it('should allow moving row', expectAllowed('row.move', {
    index: 0
  }));


  it('should NOT allow moving row', expectNotAllowed('row.move', {
    index: 1
  }));


  it('should allow adding col', expectAllowed('col.add', {
    index: 0
  }));


  it('should NOT allow adding col', expectNotAllowed('col.add', {
    index: 1
  }));


  it('should allow moving col', expectAllowed('col.move', {
    index: 0
  }));


  it('should NOT allow moving col', expectNotAllowed('col.move', {
    index: 1
  }));


  it('should allow pasting rows', expectAllowed('paste', {
    elements: new Row(),
    target: new Row()
  }));


  it('should NOT allow pasting rows', expectNotAllowed('paste', {
    elements: new Row(),
    target: new Col()
  }));


  it('should allow pasting cols', expectAllowed('paste', {
    elements: new Col(),
    target: new Col()
  }));


  it('should NOT allow pasting cols', expectNotAllowed('paste', {
    elements: new Col(),
    target: new Row()
  }));

});

// helpers //////////

function expectAllowed(command, context) {
  return inject(function(rules) {
    expect(rules.allowed(command, context)).to.be.true;
  });
}

function expectNotAllowed(command, context) {
  return inject(function(rules) {
    expect(rules.allowed(command, context)).to.be.false;
  });
}