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

    it('should create a block with a numbered list with a single item, move the cursor to the end of the item, insert line break and have 2 items in the list, the second one empty, and the cursor on it', () => {
      let s1 = createSlateBlock();

      s1.typeInSlate('hello, world');

      // select all contents of slate block
      // - this opens hovering toolbar
      cy.contains('hello, world').then((el) => {
        selectSlateNodeOfWord(el);
      });

      // this is the numbered list option in the hovering toolbar
      cy.get('.slate-inline-toolbar > :nth-child(9)').click();

      // move the text cursor
      getSelectedSlateEditor().type('{rightarrow}');

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
                  type: 'paragraph',
                  children: [{ text: 'hello, world' }],
                },
              ],
            },
            {
              type: 'list-item',
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: '' }],
                },
              ],
            },
          ],
        },
      ]);
    });
  });
}
