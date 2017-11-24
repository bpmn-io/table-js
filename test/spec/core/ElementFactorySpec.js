import { inject, bootstrap } from 'test/TestHelper';


describe('ElementFactory', function() {

  beforeEach(bootstrap());


  it('root', inject(function(elementFactory) {
    
    // when
    const root = elementFactory.createRoot({
      foo: 'foo'
    });

    // then
    expect(root.rows).to.exist;
    expect(root.cols).to.exist;
    expect(root.id).to.exist;
    expect(root.foo).to.eql('foo');

  }));


  it('row', inject(function(elementFactory) {
    
    // when
    const row = elementFactory.createRow({
      foo: 'foo'
    });

    // then
    expect(row.cells).to.exist;
    expect(row.id).to.exist;
    expect(row.foo).to.eql('foo');

  }));


  it('col', inject(function(elementFactory) {
    
    // when
    const col = elementFactory.createCol({
      foo: 'foo'
    });

    // then
    expect(col.cells).to.exist;
    expect(col.id).to.exist;
    expect(col.foo).to.eql('foo');

  }));

});