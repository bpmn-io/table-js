import { Component } from 'inferno';

import {
  classNames,
  inject,
  mixin
} from './utils';

import {
  SelectionAware
} from './mixins';


export default class BaseCell extends Component {

  constructor(props, context) {
    super(props, context);

    mixin(this, SelectionAware);

    inject(this);
  }

  getRenderProps(...cls) {

    const {
      className,
      elementId,
      coords,
      ...props
    } = this.props;

    const baseProps = {
      className: classNames(
        ...cls,
        this.getSelectionClasses(),
        className
      )
    };

    if (elementId) {
      baseProps['data-element-id'] = elementId;
    }

    if (coords) {
      baseProps['data-coords'] = coords;
    }

    return {
      ...baseProps,
      ...props
    };
  }

}