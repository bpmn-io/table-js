import Inferno from 'inferno';
import Component from 'inferno-component';

export default class TableComponent extends Component {
  constructor(props) {
    super(props);

    const { injector } = props;

    this._elementRegistry = injector.get('elementRegistry');
    this._sheet = injector.get('sheet');

    this.elementsChangedListeners = {};

    this.onElementsChanged = this.onElementsChanged.bind(this);
  }

  onElementsChanged(event) {
    const { elements } = event;
    
    const invoked = {};

    elements.forEach(element => {
      const { id } = element;

      // update self
      if (element === this._sheet.getRoot()) {
        this.forceUpdate();
      }

      if (id in invoked) {
        return false;
      }

      invoked[id] = true;

      this.elementsChangedListeners[id] && this.elementsChangedListeners[id]();
    });
  }

  getChildContext() {
    return {
      elementsChangedListeners: this.elementsChangedListeners,
      eventBus: this.props.eventBus,
      injector: this.props.injector
    };
  }

  componentWillMount() {
    this.props.eventBus.on('elements.changed', this.onElementsChanged);
  }

  componentWillUnmount() {
    this.props.eventBus.off('elements.changed', this.onElementsChanged);
  }

  render() {
    const { rows, cols } = this._sheet.getRoot();

    const { eventBus } = this.props;

    const Head = eventBus.fire('render.head');
    const Body = eventBus.fire('render.body');
    const Foot = eventBus.fire('render.foot');

    return (
      <table>
        { Head && <Head rows={ rows } cols={ cols } /> }
        { Body && <Body rows={ rows } cols={ cols } /> }
        { Foot && <Foot rows={ rows } cols={ cols } /> }
      </table>
    );
  }
}