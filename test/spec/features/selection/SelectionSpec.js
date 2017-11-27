import Inferno from 'inferno';

import { query as domQuery } from 'min-dom';

import { inject, bootstrap } from 'test/TestHelper';

import SelectionModule from 'lib/features/selection';


describe('Selection', function() {

  beforeEach(bootstrap({
    modules: [ SelectionModule ]
  }));

  
});