import { Component } from 'inferno';

/**
 * @template { { injector: import('didi').Injector } } P
 * @template [S={}]
 *
 * @extends { Component<P, S> }
 */
export default class DiContainer extends Component {

  getChildContext() {

    return {
      injector: this.props.injector
    };

  }

  render() {
    return this.props.children;
  }

}