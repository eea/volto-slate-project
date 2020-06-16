import {
  createSlateBlock,
  getSlateBlockValue,
  getSelectedSlateEditor,
  selectSlateNodeOfWord,
  slateBeforeEach,
} from '../../support';

if (Cypress.env('API') !== 'guillotina') {
  describe('Slate.js Volto blocks', () => {
    beforeEach(slateBeforeEach);

    it('should create a block with a numbered list with a single item, move the cursor in approximatively the middle of the item, insert a line break, and then have 2 items with the two parts of the initial item: two items in a single numbered list: 1. and 2.', () => {
      let s1 = createSlateBlock();

      s1.typeInSlate('hello, world');

      // select all contents of slate block
      // - this opens hovering toolbar
      cy.contains('hello, world').then((el) => {
        selectSlateNodeOfWord(el);
      });

      // this is the numbered list option in the hovering toolbar
      cy.get('.slate-inline-toolbar > :nth-child(8)').click();

      // move the text cursor
      getSelectedSlateEditor().type(
        '{leftarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}',
      );

      // simulate pressing Enter
      getSelectedSlateEditor().lineBreakInSlate();

      // there should be 1 slate blocks on the page
      cy.get('.block-editor-slate').should('have.length', 1);

      getSlateBlockValue(cy.get('.slate-editor').first()).should('deep.eq', [
        {
          type: 'numbered-list',
          children: [
            {
              type: 'list-item',
              children: [
                {
                  text: 'hello',
                },
              ],
            },
            {
              type: 'list-item',
              children: [
                {
                  text: ', world',
                },
              ],
            },
          ],
        },
      ]);
    });
  });
}