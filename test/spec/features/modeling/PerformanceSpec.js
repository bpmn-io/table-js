import { inject, bootstrap } from 'test/TestHelper';

import ModelingModule from 'src/features/modeling';


describe('modeling - performance', function() {

  beforeEach(bootstrap({
    modules: [ ModelingModule ]
  }));


  it.skip('should add 20000 cells', inject(function(modeling, sheet) {

    let now = performance.now();

    for (let j = 0; j < 2000; j++) {
      modeling.addRow();
    }

    console.log('rows added', (performance.now() - now));

    now = performance.now();

    for (let i = 0; i < 20; i++) {
      modeling.addCol();
    }

    console.log('cols added', (performance.now() - now));
  }));

});