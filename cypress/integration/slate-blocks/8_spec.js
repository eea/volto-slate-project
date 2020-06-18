import {
  createSlateBlock,
  getSlateBlockValue,
  getSelectedSlateEditor,
  selectSlateNodeOfWord,
  slateBeforeEach,
  getSlateBlockSelection,
} from '../../support';

if (Cypress.env('API') !== 'guillotina') {
  describe('Slate.js Volto blocks', () => {
    beforeEach(slateBeforeEach);

    // TODO: should create a slate block after a normal block, after a title block etc.
    // TODO: test numbered list context as well

    it('should go to next block when pressing Tab key at beginning, end of a block, S-tab should do the opposite', () => {
      const fs1 = 'hello, world';
      const fs2 = 'welcome aboard';

      let s1 = createSlateBlock();
      s1.typeInSlate(fs1);

      let s2 = createSlateBlock();
      s2.typeInSlate(fs2);

      // focus the previous Slate editor (the first) with S-tab
      getSelectedSlateEditor().tab({ shift: true });


      // cy.wait(1000);

      // getSelectedSlateEditor().type('{uparrow}');

      // cy.wait(1000);

      // // move the text cursor
      // getSelectedSlateEditor().type(
      //   '{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}',
      // );

      // cy.wait(1000);

      // getSelectedSlateEditor().type('{downarrow}');

      // // sometimes this prevents the next assertion to fail, saying that the correct offset is something else
      // cy.wait(1000);

      // getSlateBlockSelection(cy.get('.slate-editor').first()).should(
      //   'deep.eq',
      //   {
      //     anchor: { path: [0, 0], offset: fs1.length },
      //     focus: { path: [0, 0], offset: fs1.length },
      //   },
      // );

      // getSelectedSlateEditor().type('{downarrow}');

      // // the last Slate block should be focused
      // cy.get('.slate-editor')
      //   .last()
      //   .then((editorElement) => {
      //     return cy.focused().then((focusedEl) => {
      //       return Cypress.$.contains(editorElement[0], focusedEl[0]);
      //     });
      //   })
      //   .should('eq', true);

      // // there should be 2 slate blocks on the page
      // cy.get('.block-editor-slate').should('have.length', 2);

      // // selection of last block should be at end of the block
      // getSlateBlockSelection(cy.get('.slate-editor').last()).should('deep.eq', {
      //   anchor: { path: [0, 0], offset: fs2.length },
      //   focus: { path: [0, 0], offset: fs2.length },
      // });
    });
  });
}
