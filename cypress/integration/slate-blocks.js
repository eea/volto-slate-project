if (Cypress.env('API') !== 'guillotina') {
  describe('Slate.js Volto blocks', () => {
    const createSlateBlock = () => {
      cy.get('.block-editor-text').last().click();

      // click the add block button
      cy.get('.inner > .block > .ui > .icon').click();

      // Text section in block type selector
      cy.get('.accordion > :nth-child(3)').click();

      // click the Slate block button (the first one is in the Most Used section, the last one is surely the good one)
      cy.get('button.ui.basic.icon.button.slate').last().click();

      return cy.get('.slate-editor.selected [contenteditable=true]');
    };

    const getSlateBlockPlaintext = (sb) => {
      return sb.invoke('text');
    };

    const getSlateBlockValue = (sb) => {
      return sb.invoke('attr', 'data-slate-value').then((str) => {
        return JSON.parse(str);
      });
    };

    beforeEach(() => {
      // if I use these 2 calls as in https://github.com/plone/volto/blob/master/cypress/support/index.js the tests fail for sure
      cy.exec('yarn cy:test:fixture:teardown');
      cy.exec('yarn cy:test:fixture:setup');

      cy.autologin();
      cy.createContent({
        contentType: 'Document',
        contentId: 'my-page',
        contentTitle: 'My Page',
      });
      cy.visit('/my-page');

      cy.waitForResourceToLoad('@navigation');
      cy.waitForResourceToLoad('@breadcrumbs');
      cy.waitForResourceToLoad('@actions');
      cy.waitForResourceToLoad('@types');
      cy.waitForResourceToLoad('my-page?fullobjects');

      cy.navigate('/my-page/edit');
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

    // it('should do the same as the test above but within a list (including edge cases)', () => {});
  });
}
