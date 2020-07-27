import {
  createSlateBlock,
  getSlateBlockValue,
  getSelectedSlateEditor,
  selectSlateNodeOfWord,
  slateBeforeEach,
  getAllSlateBlocks,
  slateBlockValueShouldBe,
} from '../../support';

if (Cypress.env('API') !== 'guillotina') {
  describe('Slate.js Volto blocks', () => {
    beforeEach(slateBeforeEach);

    it('should create a block with a numbered list with a single item, move the cursor to the end of the item, insert line break, have two items, the cursor on the last one, which is empty, and then another line break should create a new block which is of type `paragraph`', () => {
      let s1 = createSlateBlock(true);

      s1.typeInSlate('hello, world');

      // select all contents of slate block
      // - this opens hovering toolbar
      cy.contains('hello, world').then((el) => {
        selectSlateNodeOfWord(el);
      });

      // this is the numbered list option in the hovering toolbar
      cy.get('.slate-inline-toolbar .button-wrapper:nth-child(12)')
        .justVisible()
        .click();

      // move the text cursor
      getSelectedSlateEditor().type('{rightarrow}');

      // simulate pressing Enter
      getSelectedSlateEditor().lineBreakInSlate();

      // simulate pressing Enter again
      getSelectedSlateEditor().lineBreakInSlate();

      // there should be 3 slate blocks on the page
      getAllSlateBlocks().should('have.length', 3);

      slateBlockValueShouldBe(0, [
        {
          type: 'ol',
          children: [
            {
              type: 'li',
              children: [{ text: 'hello, world' }],
            },
          ],
        },
      ]);

      slateBlockValueShouldBe(1, [
        {
          type: 'p',
          children: [
            {
              text: '',
            },
          ],
        },
      ]);
    });
  });
}
