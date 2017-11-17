
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';


export default class ContextMenuComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      position: {
        x: 0,
        y: 0
      }
    };

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  open(position, context = {}) {
    if (!position) {
      throw new Error('must specifiy context menu position');
    }
    
    this.setState({
      isOpen: true,
      position,
      context
    }, () => {
      this._eventBus && this._eventBus.fire('contextMenu.opened', {
        position,
        context
      });
    });
  }

  close() {
    this.setState({
      isOpen: false
    });
  }

  componentWillMount() {
    const { injector } = this.context;
    
    this._components = injector.get('components');

    const eventBus = this._eventBus = injector.get('eventBus');

    eventBus.on('contextMenu.open', ({ position, context }) => {
      this.open(position, context);
    });

    eventBus.on('contextMenu.close', this.close);
  }

  render() {
    const { context, isOpen, position } = this.state;

    const contextMenuComponents = this._components.getComponents('context-menu', context);

    if (!contextMenuComponents || !contextMenuComponents.length) {
      return null;
    }

    return (
      isOpen &&
        <div 
          style={{
            top: position.y,
            left: position.x
          }}
          onContextMenu={ e => e.preventDefault() }
          className="context-menu">
          { contextMenuComponents && contextMenuComponents.map(Component => <Component />) }
        </div>
    );
  }
}