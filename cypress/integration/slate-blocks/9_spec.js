import {
  createSlateBlock,
  getSlateBlockValue,
  getSelectedSlateEditor,
  selectSlateNodeOfWord,
  slateBeforeEach,
  getSlateBlockSelection,
  createSlateBlockWithList,
} from '../../support';

if (Cypress.env('API') !== 'guillotina') {
  describe('Slate.js Volto blocks', () => {
    beforeEach(slateBeforeEach);

    // TODO: should create a slate block after a normal block, after a title block etc.
    // TODO: test numbered list context as well

    // TODO: test the reverse, with Shift-Tab too!
    it('[not fully implemented] in a list item, pressing Tab should increase indent level', () => {
      // TODO: make a test with numbered: false
      createSlateBlockWithList({
        numbered: true,
        firstItemText: 'hello world',
        secondItemText: 'welcome aboard',
      });

      cy.wait(2000);
      let se = cy.get('.slate-editor').first();
      cy.wait(2000);

      cy.focused().tab();
      cy.wait(2000);

      // there should be 1 slate blocks on the page
      // TODO: the same test with 2 slate blocks in the page
      cy.get('.block-editor-slate').should('have.length', 1);

      getSlateBlockValue(se).then((val) => {
        expect(val).to.deep.equal([
          {
            type: 'numbered-list',
            children: [
              {
                type: 'list-item',
                children: [
                  {
                    text: 'hello world',
                  },
                ],
              },
              {
                type: 'numbered-list',
                children: [
                  {
                    type: 'list-item',
                    children: [
                      {
                        text: 'welcome aboard',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ]);
      });

      cy.focused().tab();
      cy.pause();

      getSlateBlockValue(se).should('deep.eq', [
        {
          type: 'numbered-list',
          children: [
            {
              type: 'list-item',
              children: [
                {
                  text: 'hello world',
                },
              ],
            },
            {
              type: 'numbered-list',
              children: [
                {
                  type: 'list-item',
                  children: [
                    {
                      text: 'welcome aboard',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]);

      cy.focused().tab({ shift: true });

      cy.focused().tab({ shift: true });
    });
  });
}
