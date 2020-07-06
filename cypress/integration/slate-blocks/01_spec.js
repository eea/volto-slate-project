import {
  createSlateBlock,
  slateBeforeEach,
  getSelectedSlateEditor,
} from '../../support';

if (Cypress.env('API') !== 'guillotina') {
  describe('Slate.js Volto blocks', () => {
    beforeEach(slateBeforeEach);

    it('should create 4 slate blocks, first 3 with mouse, the last with an Enter in the third block', () => {
      // first Slate block
      let s1 = createSlateBlock(true);
      s1.typeInSlate('Hello Slate World!');
      s1.lineBreakInSlate(); // second

      let se = getSelectedSlateEditor();

      se.typeInSlate('Hello Volto World!');
      se.lineBreakInSlate(); // third

      se = getSelectedSlateEditor();

      se.typeInSlate('Hello Cypress World!');
      se.lineBreakInSlate(); // fourth

      // fifth = the new-default-block at the end, created automatically
      cy.get('.block-editor-slate').should('have.length', 5);
    });
  });
}
