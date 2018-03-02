import { every, isArray } from 'lodash';

import { Row, Col } from '../../model';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

export default class ModelingRules extends RuleProvider {
  constructor(eventBus, sheet) {
    super(eventBus);

    this._sheet = sheet;
  }

  init() {
    this.addRule([
      'row.add',
      'row.move'
    ], ({ index }) => {
      const { rows } = this._sheet.getRoot();

      return index <= rows.length;
    });

    this.addRule([
      'col.add',
      'col.move'
    ], ({ index }) => {
      const { cols } = this._sheet.getRoot();

      return index <= cols.length;
    });

    this.addRule('paste', ({ elements, target }) => {
      if (!isArray(elements)) {
        elements = [ elements ];
      }

      if (target instanceof Row) {
        return every(elements, element => element instanceof Row);
      } else if (target instanceof Col) {
        return every(elements, element => element instanceof Col);
      }

      return false;
    });
  }
}

ModelingRules.$inject = [ 'eventBus', 'sheet' ];