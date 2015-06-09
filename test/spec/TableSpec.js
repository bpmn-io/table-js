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

      var table = new Table({
        sheet: {
          container: container,
          width: 700,
          height: 500
        }
      });
    });


    it('should offer #destroy method', function() {

      // when
      var table = new Table({
        sheet: {
          container: container,
          width: 700,
          height: 500
        }
      });

      // then
      expect(table.destroy).to.be.an('function');
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
            width: 700,
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
