
// TODO: instead of listening to click event make it react to sth like selection.select
export default class Highlighting {

  constructor(eventBus) {
    this.node = undefined;
    
    eventBus.on('cell.click', ({ id, node }) => {
      node.classList.add('highlight');

      if (this.node && node !== this.node) {
        this.node.classList.remove('highlight');
      }

      this.node = node;
    });

    document.body.addEventListener('click', event => {
      if (!(event.target.closest('th') === this.node) && 
          !(event.target.closest('td') === this.node)) {
        this.node && this.node.classList.remove('highlight');
      }
    });
  }

}

Highlighting.$inject = [ 'eventBus' ];