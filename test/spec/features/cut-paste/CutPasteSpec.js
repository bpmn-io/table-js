import { inject, bootstrap } from 'test/TestHelper';

import CutPasteModule from 'lib/features/cut-paste';


describe('CutPaste', function() {

  beforeEach(bootstrap({
    modules: [ CutPasteModule ]
  }));

  let col1,
      col2,
      col3,
      row1,
      row2,
      row3;

  beforeEach(inject(function(modeling) {

    col1 = modeling.addCol({ id: 'col1', cells: [] });
    col2 = modeling.addCol({ id: 'col2', cells: [] });
    col3 = modeling.addCol({ id: 'col3', cells: [] });

    row1 = modeling.addRow({ id: 'row1', cells: [ {}, {}, {} ] });
    row2 = modeling.addRow({ id: 'row2', cells: [ {}, {}, {} ] });
    row3 = modeling.addRow({ id: 'row3', cells: [ {}, {}, {} ] });

  }));


  it('should cut row', inject(function(clipBoard, cutPaste, sheet) {

    // when
    cutPaste.cut(row1);

    // then
    const root = sheet.getRoot();

    expect(root.rows).to.eql([ row2, row3 ]);
    expect(clipBoard.getElement()).to.eql(row1);
  }));


  it('paste row before', inject(function(clipBoard, cutPaste, sheet) {
    
    // given
    cutPaste.cut(row1);

    // when
    cutPaste.pasteBefore(row3);

    // then
    const root = sheet.getRoot();

    expect(root.rows).to.eql([ row2, row1, row3 ]);
    expect(clipBoard.hasElement()).to.be.false;
  }));


  it('paste row after', inject(function(clipBoard, cutPaste, sheet) {
    
    // given
    cutPaste.cut(row1);

    // when
    cutPaste.pasteAfter(row3);

    // then
    const root = sheet.getRoot();

    expect(root.rows).to.eql([ row2, row3, row1 ]);
    expect(clipBoard.hasElement()).to.be.false;
  }));


  it('should cut col', inject(function(clipBoard, cutPaste, sheet) {

    // when
    cutPaste.cut(col1);

    // then
    const root = sheet.getRoot();

    expect(root.cols).to.eql([ col2, col3 ]);
    expect(clipBoard.getElement()).to.eql(col1);
  }));


  it('paste col before', inject(function(clipBoard, cutPaste, sheet) {
    
    // given
    cutPaste.cut(col1);

    // when
    cutPaste.pasteBefore(col3);

    // then
    const root = sheet.getRoot();

    expect(root.cols).to.eql([ col2, col1, col3 ]);
    expect(clipBoard.hasElement()).to.be.false;
  }));


  it('paste col after', inject(function(clipBoard, cutPaste, sheet) {
    
    // given
    cutPaste.cut(col1);

    // when
    cutPaste.pasteAfter(col3);

    // then
    const root = sheet.getRoot();

    expect(root.cols).to.eql([ col2, col3, col1 ]);
    expect(clipBoard.hasElement()).to.be.false;
  }));

});