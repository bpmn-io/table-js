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

});