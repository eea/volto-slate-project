import {
  createSlateBlock,
  getSlateBlockValue,
  getSelectedSlateEditor,
  selectSlateNodeOfWord,
  slateBeforeEach,
  getSlateBlockSelection,
  createSlateBlocks,
} from '../../support';

if (Cypress.env('API') !== 'guillotina') {
  describe('Slate.js Volto blocks', () => {
    beforeEach(slateBeforeEach);

    // TODO: should create a slate block after a normal block, after a title block etc.
    // TODO: test numbered list context as well

    it('should create two slate blocks, type something in the first block, press Down, go to end of block, press Down, focus next Slate block', () => {
      const fs1 = 'hello, world';
      const fs2 = 'welcome aboard';
      createSlateBlocks([fs1, fs2]);

      // move the text cursor
      getSelectedSlateEditor().type('{uparrow}');

      cy.wait(1000);

      getSelectedSlateEditor().type('{uparrow}');

      cy.wait(1000);

      // move the text cursor
      getSelectedSlateEditor().type(
        '{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}',
      );

      cy.wait(1000);

      getSelectedSlateEditor().type('{downarrow}');

      // sometimes this prevents the next assertion to fail, saying that the correct offset is something else
      cy.wait(1000);

      getSlateBlockSelection(cy.get('.slate-editor').first()).should(
        'deep.eq',
        {
          anchor: { path: [0, 0], offset: fs1.length },
          focus: { path: [0, 0], offset: fs1.length },
        },
      );

      getSelectedSlateEditor().type('{downarrow}');

      // the last Slate block should be focused
      cy.get('.slate-editor')
        .eq(1)
        .then((editorElement) => {
          return cy.focused().then((focusedEl) => {
            return Cypress.$.contains(editorElement[0], focusedEl[0]);
          });
        })
        .should('eq', true);

      // there should be 3 slate blocks on the page
      cy.get('.block-editor-slate').should('have.length', 3);

      // selection of last block should be at end of the block
      getSlateBlockSelection(cy.get('.slate-editor').eq(1)).should('deep.eq', {
        anchor: { path: [0, 0], offset: fs2.length },
        focus: { path: [0, 0], offset: fs2.length },
      });
    });
  });
}
