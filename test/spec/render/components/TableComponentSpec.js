
// eslint-disable-next-line
import Inferno from 'inferno';

// eslint-disable-next-line
import Component from 'inferno-component';

import { findRenderedDOMElementWithClass, renderIntoDocument } from 'inferno-test-utils';

import { inject, bootstrap } from 'test/TestHelper';

import TableComponent from 'lib/render/components/TableComponent';


describe('TableComponent', function() {
  
  beforeEach(bootstrap({}));


  it('should render table', inject(function(injector) {

    // when
    const renderedTree = renderIntoDocument(<TableComponent injector={ injector } />);

    // then
    const result = findRenderedDOMElementWithClass(renderedTree, 'tjs-table');

    expect(result).to.exist;
  }));


  it('should render head, body & foot', inject(function(components, injector) {

    // given
    components.onGetComponent('table.head', () => () => <thead className="head"></thead>);
    components.onGetComponent('table.body', () => () => <tbody className="body"></tbody>);
    components.onGetComponent('table.foot', () => () => <tfoot className="foot"></tfoot>);

    // when
    const renderedTree = renderIntoDocument(<TableComponent injector={ injector } />);

    // then
    expect(findRenderedDOMElementWithClass(renderedTree, 'head')).to.exist;
    expect(findRenderedDOMElementWithClass(renderedTree, 'body')).to.exist;
    expect(findRenderedDOMElementWithClass(renderedTree, 'foot')).to.exist;
  }));


  it('should render before table', inject(function(components, injector) {

    // given
    components.onGetComponent('table.before', () => () => <div className="before"></div>);

    // when
    const renderedTree = renderIntoDocument(<TableComponent injector={ injector } />);

    // then
    expect(findRenderedDOMElementWithClass(renderedTree, 'before')).to.exist;

  }));


  it('should render after table', inject(function(components, injector) {
    
    // given
    components.onGetComponent('table.after', () => () => <div className="after"></div>);

    // when
    const renderedTree = renderIntoDocument(<TableComponent injector={ injector } />);

    // then
    expect(findRenderedDOMElementWithClass(renderedTree, 'after')).to.exist;

  }));


  it('should provide child context', inject(function(components, injector) {
    
    // given
    class Body extends Component {
      componentWillMount() {

        // then
        expect(this.context.injector).to.exist;
      }
    }

    components.onGetComponent('table.body', () => Body);

    // when
    renderIntoDocument(<TableComponent injector={ injector } />);
  }));

});