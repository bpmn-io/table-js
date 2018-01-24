import Table from 'lib/Table';

import { domify, remove as domRemove } from 'min-dom';


describe('Table', function() {

  let container;

  beforeEach(function() {
    container = domify('<div></div>');

    document.body.appendChild(container);
  });

  afterEach(function() {
    domRemove(container);
  });


  it('should bootstrap', function() {

    // given
    const modules = [
      {
        foo: [ 'value', 1 ]
      }
    ];

    // when
    var table = new Table({
      renderer: {
        container
      },
      modules,
      bar: 'BAR'
    });

    // then
    expect(table.get('foo')).to.eql(1);

    expect(table.get('config')).to.eql({
      renderer: {
        container
      },
      bar: 'BAR'
    });
  });


  it('#destroy', function() {

    // when
    const table = new Table({
      renderer: {
        container
      }
    });

    // then
    expect(table.destroy).to.be.a('function');
  });


  it('#clear', function() {

    // when
    const table = new Table({
      renderer: {
        container
      }
    });

    // then
    expect(table.clear).to.be.a('function');
  });

});