import {
  createSlateBlock,
  getSlateBlockPlaintext,
  getSlateBlockValue,
  slateBeforeEach,
  getSelectedSlateEditor,
} from './common';

if (Cypress.env('API') !== 'guillotina') {
  describe('Slate.js Volto blocks', () => {
    beforeEach(() => {
      slateBeforeEach();
    });

    it('should do the same as the test above but within a list (including edge cases)', () => {
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

      getSelectedSlateEditor()
        .type(
          '{leftarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}',
        )
        .lineBreakInSlate();

      cy.get('.block-editor-slate').should('have.length', 2);

      // getSlateBlockValue(cy.get('.slate-editor').first()).should('deep.eq', [
      //   {
      //     type: 'paragraph',
      //     children: [{ text: 'hello, ' }],
      //   },
      // ]);
      // getSlateBlockValue(cy.get('.slate-editor').last()).should('deep.eq', [
      //   {
      //     type: 'paragraph',
      //     children: [{ text: 'world' }],
      //   },
      // ]);
    });
  });
}
