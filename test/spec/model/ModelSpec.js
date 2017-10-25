import { create } from 'lib/model';

describe('model', function() {

  it('should create <root>', function() {

    // when
    const table = create('root');

    // then
    expect(table.rows).to.exist;
    expect(table.cols).to.exist;
  });


  it('should create <row>', function() {
    
    // when
    const row = create('row');

    // then
    expect(row.cells).to.exist;
  });


  it('should create <col>', function() {
    
    // when
    const col = create('col');

    // then
    expect(col.cells).to.exist;
  });

});