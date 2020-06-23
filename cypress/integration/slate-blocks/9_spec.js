import {
  createSlateBlock,
  getSlateBlockValue,
  getSelectedSlateEditor,
  selectSlateNodeOfWord,
  slateBeforeEach,
  getSlateBlockSelection,
  getSelectedUneditableSlateEditor,
  createSlateBlockWithList,
} from '../../support';

const indent0 = [
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
        type: 'list-item',
        children: [
          {
            text: 'welcome aboard',
          },
        ],
      },
    ],
  },
];

const indent1 = [
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
];

if (Cypress.env('API') !== 'guillotina') {
  describe.skip('Slate.js Volto blocks', () => {
    beforeEach(slateBeforeEach);

    // TODO: should create a slate block after a normal block, after a title block etc.
    // TODO: test numbered list context as well

    it('in a list item, pressing Tab should increase indent level, Shift-Tab the reverse', () => {
      // TODO: make a test with numbered: false
      createSlateBlockWithList({
        numbered: true,
        firstItemText: 'hello world',
        secondItemText: 'welcome aboard',
      });

      getSlateBlockValue(getSelectedUneditableSlateEditor()).then((val) => {
        expect(val).to.deep.equal(indent0);
      });

      cy.wait(1000);

      cy.focused().tab();
      cy.wait(1000);

      // there should be 1 slate blocks on the page
      // TODO: the same test with 2 slate blocks in the page
      cy.get('.block-editor-slate').should('have.length', 1);

      getSlateBlockValue(getSelectedUneditableSlateEditor()).then((val) => {
        expect(val).to.deep.equal(indent1);
      });

      cy.focused().tab();

      getSlateBlockValue(getSelectedUneditableSlateEditor()).should('deep.eq', [
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
          ],
        },
      ]);

      cy.focused().tab({ shift: true });

      getSlateBlockValue(getSelectedUneditableSlateEditor()).then((val) => {
        expect(val).to.deep.equal(indent1);
      });

      cy.focused().tab({ shift: true });

      getSlateBlockValue(getSelectedUneditableSlateEditor()).then((val) => {
        expect(val).to.deep.equal(indent0);
      });
    });
  });
}
