import BaseCell from './BaseCell';


export default class HeaderCell extends BaseCell {

  constructor(props, context) {
    super(props, context);

    this.state = {};
  }

  render() {

    const {
      children
    } = this.props;

    const props = this.getRenderProps('cell');

    return (
      <td { ...props }>
        { children }
      </td>
    );
  }

}