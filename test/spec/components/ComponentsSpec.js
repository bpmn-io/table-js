import {
  Cell,
  classNames,
  HeaderCell,
  DiContainer,
  inject,
  mixin
} from 'src/components';

import {
  Component,
  render
} from 'inferno';

import {
  createInjector
} from 'test/util';


describe('components', function() {

  it('classNames', function() {

    expect(
      classNames('foo', 'bar', 0, null, { a: 1, b: 0 })
    ).to.eql('foo bar a');
  });


  it('HeaderCell', function() {
    expect(HeaderCell).to.exist;
  });


  it('Cell', function() {
    expect(Cell).to.exist;
  });


  it('DiContainer', function() {

    const foo = {};

    class TestComponent extends Component {

      constructor(props, context) {
        super(props, context);

        inject(this);
      }

      componentWillMount() {
        expect(this.foo).to.equal(foo);

        foo.mounted = true;
      }
    }

    TestComponent.$inject = [ 'foo' ];

    // when
    mount(
      <DiContainer injector={ createInjector({ foo }) }>
        <TestComponent />
      </DiContainer>
    );

    // then
    expect(foo.mounted).to.be.true;
  });



  describe('utils', function() {

    it('mixin', function() {

      const foo = { lastName: 'BERT' };

      const FooMixin = {

        hello(name) {
          this.didHello = name;
        },

        componentWillMount() {
          expect(this.foo).to.equal(foo);

          this.hello(this.foo.lastName);
        }
      };

      FooMixin.$inject = [ 'foo' ];


      class TestComponent extends Component {

        constructor(props, context) {
          super(props, context);

          mixin(this, FooMixin);

          inject(this);
        }

        componentDidMount() {
          expect(this.didHello).to.eql(this.foo.lastName);

          foo.mounted = true;
        }
      }


      // when
      mount(
        <DiContainer injector={ createInjector({ foo }) }>
          <TestComponent />
        </DiContainer>
      );

      // then
      expect(foo.mounted).to.be.true;
    });

  });

});


// helpers ///////////////////


function mount(vNode) {
  var container = document.createElement('div');

  return render(vNode, container);
}