if (Cypress.env('API') !== 'guillotina') {
  describe('Login Tests', () => {
    it('Creates a new page with 3 Slate blocks', () => {
      cy.voltoLogin('admin', 'admin');

      cy.get('#toolbar-add').click();
      cy.get('#toolbar-add-document').click();
      cy.get('.block-editor-title').type('Testing Slate blocks');

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

      let s1 = createSlateBlock();
      s1.typeInSlate('Hello Slate World!');

      let s2 = createSlateBlock();
      s2.typeInSlate('Hello Volto World!');

      let s3 = createSlateBlock();
      s3.typeInSlate('Hello Cypress World!');
    });
  });
}
