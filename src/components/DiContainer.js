import React, { PureComponent } from 'react';


export default class DiContainer extends PureComponent {

  getChildContext() {

    return {
      injector: this.props.injector
    };

  }

  render() {
    return this.props.children;
  }

}