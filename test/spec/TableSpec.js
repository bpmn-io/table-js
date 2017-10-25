import Table from 'lib/Table';


describe('Table', function() {

  let container;

  beforeEach(function() {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(function() {
    container.parentNode.removeChild(container);
  });


  it('should construct with { modules, config }', function() {

    // given
    var modules = [
      {
        foo: [ 'value', 1 ]
      }
    ];

    // when
    var table = new Table({ container, modules, bar: 'BAR' });

    // then
    expect(table.get('foo')).to.eql(1);

    expect(table.get('config')).to.eql({
      container: container,
      bar: 'BAR'
    });
  });

});