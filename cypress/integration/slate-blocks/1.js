import {
  createSlateBlock,
  getSlateBlockPlaintext,
  getSlateBlockValue,
  slateBeforeEach,
} from './common';

if (Cypress.env('API') !== 'guillotina') {
  describe('Slate.js Volto blocks', () => {
    beforeEach(() => {
      slateBeforeEach();
    });

    it('should create 4 slate blocks, first 3 with mouse, the last with an Enter in the third block', () => {
      let s1 = createSlateBlock();
      s1.typeInSlate('Hello Slate World!');

      let s2 = createSlateBlock();
      s2.typeInSlate('Hello Volto World!');

      let s3 = createSlateBlock();
      s3.typeInSlate('Hello Cypress World!');
      s3.lineBreakInSlate();

      cy.get('.block-editor-slate').should('have.length', 4);
    });
  });
}
