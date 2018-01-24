import { inject, bootstrap } from 'test/TestHelper';


describe('ElementRegistry', function() {

  beforeEach(bootstrap());


  it('add', inject(function(elementRegistry) {

    // when
    elementRegistry.add({ id: 'foo' });

    // then
    expect(elementRegistry._elements.foo).to.exist;
    expect(Object.keys(elementRegistry._elements)).to.have.lengthOf(1);
  }));


  it('remove', inject(function(elementRegistry) {

    // given
    elementRegistry.add({ id: 'foo' });

    // when
    elementRegistry.remove('foo');

    // then
    expect(elementRegistry._elements.foo).to.not.exist;
    expect(Object.keys(elementRegistry._elements)).to.have.lengthOf(0);
  }));


  it('get', inject(function(elementRegistry) {

    // given
    elementRegistry.add({ id: 'foo' });

    // when
    const foo = elementRegistry.get('foo');

    // then
    expect(foo).to.equal(elementRegistry._elements.foo);
  }));


  it('getAll', inject(function(elementRegistry) {

    // given
    elementRegistry.add({ id: 'foo' });
    elementRegistry.add({ id: 'bar' });

    // when
    const elements = elementRegistry.getAll();

    // then
    expect(elements).to.eql([
      { id: 'foo' },
      { id: 'bar' }
    ]);
  }));


  it('forEach', inject(function(elementRegistry) {

    // given
    elementRegistry.add({ id: 'foo' });
    elementRegistry.add({ id: 'bar' });

    // when
    elementRegistry.forEach(e => e.foo = 1);

    // then
    expect(elementRegistry._elements).to.eql({
      foo: {
        id: 'foo',
        foo: 1
      },
      bar: {
        id: 'bar',
        foo: 1
      }
    });
  }));


  it('filter', inject(function(elementRegistry) {

    // given
    elementRegistry.add({ id: 'foo' });
    elementRegistry.add({ id: 'bar' });

    // when
    const elements = elementRegistry.filter(e => e.id === 'foo');

    // then
    expect(elements).to.eql([
      { id: 'foo' }
    ]);

  }));


  it('clear', inject(function(elementRegistry) {

    // given
    elementRegistry.add({ id: 'foo' });
    elementRegistry.add({ id: 'bar' });

    // when
    elementRegistry.clear();

    // then
    expect(elementRegistry._elements).to.eql({});
  }));


  it('clear on table.clear', inject(function(elementRegistry, eventBus) {

    // given
    elementRegistry.add({ id: 'foo' });
    elementRegistry.add({ id: 'bar' });

    // when
    eventBus.fire('table.clear');

    // then
    expect(elementRegistry._elements).to.eql({});
  }));

});