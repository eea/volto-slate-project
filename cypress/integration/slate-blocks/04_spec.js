import {
  createSlateBlock,
  getSlateBlockValue,
  getSelectedSlateEditor,
  selectSlateNodeOfWord,
  slateBeforeEach,
  getAllSlateBlocks,
  slateBlockValueShouldBe,
  NUMBERED_LIST_BUTTON_INDEX,
} from '../../support';

if (Cypress.env('API') !== 'guillotina') {
  describe('Slate.js Volto blocks', () => {
    beforeEach(slateBeforeEach);

    it('should create a block with a numbered list with a single item, move the cursor to the end of the item, insert line break and have 2 items in the list, the second one empty, and the cursor on it', () => {
      let s1 = createSlateBlock(true);
      s1.typeInSlate('hello, world');

      // select all contents of slate block
      // - this opens hovering toolbar
      cy.contains('hello, world').then((el) => {
        selectSlateNodeOfWord(el);
      });

      // this is the numbered list option in the hovering toolbar
      cy.get(
        `.slate-inline-toolbar .button-wrapper:nth-child(${NUMBERED_LIST_BUTTON_INDEX})`,
      )
        .justVisible()
        .click();

      // move the text cursor
      getSelectedSlateEditor().type('{rightarrow}');

      // simulate pressing Enter
      getSelectedSlateEditor().lineBreakInSlate();

      // there should 2 slate blocks on the page
      getAllSlateBlocks().should('have.length', 2);

      slateBlockValueShouldBe(0, [
        {
          type: 'ol',
          children: [
            {
              type: 'li',
              children: [{ text: 'hello, world' }],
            },
            {
              type: 'li',
              children: [{ text: '' }],
            },
          ],
        },
      ]);
    });
  });
}
