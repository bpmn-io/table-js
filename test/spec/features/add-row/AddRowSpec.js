'use strict';

var TestHelper = require('../../../TestHelper');

/* global bootstrapTable, inject */


var addRowModule = require('../../../../lib/features/add-row');


describe('features/add-row', function() {

  beforeEach(bootstrapTable({ modules: [ addRowModule ] }));

  beforeEach(inject(function(sheet) {

    sheet.addColumn({id: 'col1'});
    sheet.addColumn({id: 'col2'});
    sheet.addRow({id: 'row1'});

  }));


  describe('bootstrap', function() {

    it('should bootstrap diagram with component', inject(function() {}));

  });


  describe('interface', function() {

    it('should add a row with the interface controls', inject(function(elementRegistry) {
      //TODO: implement me
    }));

  });

});
