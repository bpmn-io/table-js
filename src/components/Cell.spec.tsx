import Cell from './Cell.js';

export class SubCell extends Cell<{ someProp: string }, { someState: number }> {

  render() {
    return <div>{ this.state?.someState } AND { this.props.someProp }</div>;
  }

}