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

    it('should create two slate blocks, type something in the second block, press Up, go to start of block, press Up, focus previous Slate block', () => {
      createSlateBlocks(['hello, world', 'welcome aboard']);

      // move the text cursor
      getSelectedSlateEditor().type(
        '{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}{uparrow}',
      );

      // sometimes this prevents the next assertion to fail, saying that the correct offset is 8
      cy.wait(1000);

      getSlateBlockSelection(cy.get('.slate-editor').eq(1)).should('deep.eq', {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      });

      getSelectedSlateEditor().type('{uparrow}');

      // TODO: complete this function and use it instead of the code below in the at least 2 tests that use it:
      // const isSlateEditorFocused = (editorEl) => {
      //   editorEl.then(el => {

      //   });
      // };

      // the first Slate block should be focused
      cy.get('.slate-editor')
        .first()
        .then((editorElement) => {
          return cy.focused().then((focusedEl) => {
            return Cypress.$.contains(editorElement[0], focusedEl[0]);
          });
        })
        .should('eq', true);

      // there should be 3 slate blocks on the page
      cy.get('.block-editor-slate').should('have.length', 3);

      // selection of first block should be at start of the block
      getSlateBlockSelection(cy.get('.slate-editor').first()).should(
        'deep.eq',
        {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        },
      );
    });
  });
}
