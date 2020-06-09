if (Cypress.env('API') !== 'guillotina') {
  describe('Login Tests', () => {
    beforeEach(() => {
      cy.visit('/');
      // cy.contains('Log in').click();
    });
    it('Creates a new page with 3 Slate blocks', () => {
      cy.autologin(); // TODO: is this used well? It does not seem to work.

      // cy.get('#login').type('admin').should('have.value', 'admin');
      // cy.get('#password').type('admin').should('have.value', 'admin');
      // cy.get('#login-form-submit').click();
      cy.get('body').should('have.class', 'has-toolbar');

      cy.get('#toolbar-add').click();
      cy.get('#toolbar-add-document').click();
      cy.get('.eight > .ui > #field-title').type('Testing Slate blocks');
      cy.get(
        '.block-editor-text > [style="position: relative;"] > .inner > .block > .DraftEditor-root > .DraftEditor-editorContainer > .notranslate > [data-contents="true"] > [data-block="true"] > .public-DraftStyleDefault-block',
      ).click();

      // click the add block button
      cy.get('.inner > .block > .ui > .icon').click();

      // Text section in block type selector
      cy.get('.accordion > :nth-child(3)').click();

      // click the Slate block button (the first one is in the Most Used section, the last one is surely the good one)
      cy.get('button.ui.basic.icon.button.slate').last().click();

      // type something in the new Slate block
      // cy.get(
      //   '#page-add > div > div > div.block-editor-slate > div > div.ui.drag.block.inner.slate > div > div > div:nth-child(2)',
      // ).type('Hello Slate World!');

      let block1 = cy.get('.slate-editor.selected [contenteditable=true]');

      // cy.get('.block-editor-slate').click();

      // setTimeout(() => {
      block1
        // .get('[data-slate-length]')
        // .first()
        .type('Hello Slate World!{enter}', { delay: 10 });
      // }, 1000);
    });
  });
}
