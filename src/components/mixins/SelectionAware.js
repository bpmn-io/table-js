import {
  classNames
} from '../utils';


/**
 * A mixin to make an element _selection aware_.
 */
const SelectionAware = {

  getSelectionClasses() {

    const {
      selected,
      selectedSecondary,
      focussed
    } = this.state;

    return classNames({
      'selected': selected,
      'selected-secondary': selectedSecondary,
      'focussed': focussed
    });
  },

  selectionChanged(newSelection) {

    // newSelection = { selected, selectedSecondary, focussed }
    this.setState(newSelection);
  },

  componentWillUpdate(newProps) {
    if (newProps.elementId !== this.props.elementId) {
      this.updateSelectionSubscription(false);
    }
  },

  componentDidUpdate(oldProps) {

    if (oldProps.elementId !== this.props.elementId) {
      this.updateSelectionSubscription(true);
    }
  },

  componentDidMount() {
    this.updateSelectionSubscription(true);
  },

  componentWillUnmount() {
    this.updateSelectionSubscription(false);
  },

  updateSelectionSubscription(enable) {
    const {
      elementId
    } = this.props;

    if (!elementId) {
      return;
    }

    if (elementId) {
      this.eventBus[enable ? 'on' : 'off'](
        `selection.${elementId}.changed`,
        this.selectionChanged
      );
    }
  },

};

export default SelectionAware;

SelectionAware.$inject = [ 'eventBus' ];