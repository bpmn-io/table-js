import Inferno from 'inferno';
import Component from 'inferno-component';

export default class TableComponent extends Component {

  constructor(props) {
    super(props);

    const { injector } = this._injector = props;

    this._sheet = injector.get('sheet');
    this._changeSupport = injector.get('changeSupport');
    this._components = injector.get('components');

    this.onElementsChanged = this.onElementsChanged.bind(this);
  }

  onElementsChanged() {
    this.forceUpdate();
  }

  getChildContext() {
    return {
      changeSupport: this._changeSupport,
      components: this._components,
      injector: this._injector
    };
  }

  componentWillMount() {
    const { id } = this._sheet.getRoot();

    this._changeSupport.onElementsChanged(id, this.onElementsChanged);
  }

  componentWillUnmount() {
    const { id } = this._sheet.getRoot();

    this._changeSupport.offElementsChanged(id, this.onElementsChanged);
  }

  render() {
    const { rows, cols } = this._sheet.getRoot();

    const beforeTableComponents = this._components.getComponents('table.before');
    const afterTableComponents = this._components.getComponents('table.after');

    const Head = this._components.getComponent('table.head');
    const Body = this._components.getComponent('table.body');
    const Foot = this._components.getComponent('table.foot');

    return (
      <div className="tjs-container">
        { beforeTableComponents && beforeTableComponents.map(Component => <Component />) }
        <table className="tjs-table">
          { Head && <Head rows={ rows } cols={ cols } /> }
          { Body && <Body rows={ rows } cols={ cols } /> }
          { Foot && <Foot rows={ rows } cols={ cols } /> }
        </table>
        { afterTableComponents && afterTableComponents.map(Component => <Component />) }
      </div>
    );
  }
}