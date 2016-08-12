'use strict';

var Table = require('../../lib/Table');


describe('table', function() {

  var container;

  beforeEach(function() {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(function() {
    container.parentNode.removeChild(container);
  });


  describe('runtime', function() {

    it('should bootstrap', function() {

      new Table({
        sheet: {
          container: container,
          width: 700,
          height: 500
        }
      });
    });


    it('should destroy', function() {
      var sheet;

      // when
      var table = new Table({
        sheet: {
          container: container,
          width: 700,
          height: 500
        }
      });

      sheet = table.get('sheet');

      table.destroy();

      // then
      expect(sheet.getRootElement()).to.not.exist;
    });


    it('should clear', function() {
      var elementRegistry,
          sheet;

      // when
      var table = new Table({
        sheet: {
          container: container,
          width: 700,
          height: 500
        }
      });

      sheet = table.get('sheet');
      elementRegistry = table.get('elementRegistry');

      sheet.addColumn({ id: 'c1' });

      expect(elementRegistry.get('c1')).to.exist;

      table.clear();

      // then
      expect(elementRegistry.get('c1')).to.not.exist;
    });


    describe('should expose table services', function() {


      it('via #get', function() {

        // when
        var table = new Table({
          sheet: {
            container: container,
            width: 700,
            height: 500
          }
        });

        // then
        expect(table.get('sheet')).to.be.an('object');
      });


      it('via #invoke', function() {

        // when
        var table = new Table({
          sheet: {
            container: container,
            width: 300,
            height: 500
          }
        });

        table.invoke([ 'sheet', function(sheet) {

          sheet.addColumn({ id: 'c1' });
          sheet.addColumn({ id: 'c2' });

          sheet.addRow({ id: 'r1' });

          sheet.setCellContent({
            column: 'c1',
            row: 'r1',
            content: 'foobar'
          });

        }]);

      });

    });

  });

});
