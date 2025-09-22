import BaseCell from './BaseCell';

/**
 * @template [P={}]
 * @template [S={}]
 *
 * @extends BaseCell<P, S>
 */
export default class HeaderCell extends BaseCell {

  constructor(props, context) {
    super(props, context);

    /**
     * @type {S}
     */
    this.state = {};
  }

  render() {

    const {
      children
    } = this.props;

    const props = this.getRenderProps('cell', 'header-cell');

    return (
      <th { ...props }>
        { children }
      </th>
    );
  }

}