import {
  createSlateBlock,
  getSlateBlockValue,
  slateBeforeEach,
} from '../../support';

if (Cypress.env('API') !== 'guillotina') {
  describe('Slate.js Volto blocks', () => {
    beforeEach(slateBeforeEach);

    it('should create a block with some text, move the cursor in the middle of the text, insert a line break, and then have 2 blocks with the two parts of the initial text', () => {
      let s1 = createSlateBlock();

      s1.typeInSlate('hello, world');

      s1.type('{leftarrow}');
      s1.type('{leftarrow}');
      s1.type('{leftarrow}');
      s1.type('{leftarrow}');
      s1.type('{leftarrow}');

      s1.lineBreakInSlate();

      cy.get('.block-editor-slate').should('have.length', 2);

      getSlateBlockValue(cy.get('.slate-editor').first()).should('deep.eq', [
        {
          type: 'paragraph',
          children: [{ text: 'hello, ' }],
        },
      ]);
      getSlateBlockValue(cy.get('.slate-editor').last()).should('deep.eq', [
        {
          type: 'paragraph',
          children: [{ text: 'world' }],
        },
      ]);
    });
  });
}
