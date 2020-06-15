import {
  createSlateBlock,
  getSlateBlockValue,
  slateBeforeEach,
  getSelectedSlateEditor,
} from './common';

if (Cypress.env('API') !== 'guillotina') {
  describe('Slate.js Volto blocks', () => {
    beforeEach(() => {
      slateBeforeEach();
    });

    it('should create a block with a numbered list with a single item, move the cursor in approximatively the middle of the item, insert a line break, and then have 2 blocks with the two parts of the initial list: two numbered lists, both starting with 1.', () => {
      let s1 = createSlateBlock();

      s1.typeInSlate('hello, world');

      // select all contents of slate block
      // - this opens hovering toolbar
      cy.contains('hello, world')
        .click()
        .then((el) => {
          cy.window().then((win) => {
            var event = new CustomEvent('Test_SelectWord', {
              detail: el[0],
              bubbles: true,
            });
            let r = win.document.dispatchEvent(event);
            console.log('dispatchEvent result', r);
          });
        });

      // this is the numbered list option in the hovering toolbar
      cy.get('.slate-inline-toolbar > :nth-child(8)').click();

      // move the text cursor
      getSelectedSlateEditor().type(
        '{leftarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}',
      );

      // simulate pressing Enter
      getSelectedSlateEditor().lineBreakInSlate();

      // there should be 2 slate blocks on the page
      cy.get('.block-editor-slate').should('have.length', 2);

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
          ],
        },
      ]);
      getSlateBlockValue(cy.get('.slate-editor').last()).should('deep.eq', [
        {
          type: 'numbered-list',
          children: [
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
