'use strict';

require('../../../TestHelper');

/* global bootstrapTable, inject */


var tableNameModule = require('../../../../lib/features/table-name');


describe('features/table-name', function() {

  beforeEach(bootstrapTable({ modules: [ tableNameModule ] }));

  describe('bootstrap', function() {

    it('should bootstrap diagram with component', inject(function() {}));

  });


  describe('interface', function() {
    it('should set the name of the table', inject(function(tableName) {
      tableName.setName('foobar');
      expect(tableName.getNode().textContent).to.eql('foobar');
    }));

    it('should get the name of the table', inject(function(tableName) {
      tableName.setName('foobar');
      expect(tableName.getName()).to.eql('foobar');
    }));

    it('name should be unaffected by transient changes', inject(function(tableName) {
      tableName.setName('TestTable');
      tableName.getNode().textContent = 'foobar';
      expect(tableName.getName()).to.eql('TestTable');
    }));
  });

});
