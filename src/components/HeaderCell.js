import BaseCell from './BaseCell.js';


export default class HeaderCell extends BaseCell {

  constructor(props, context) {
    super(props, context);

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