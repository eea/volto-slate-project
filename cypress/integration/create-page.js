if (Cypress.env('API') !== 'guillotina') {
  describe('Login Tests', () => {
    beforeEach(() => {
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

    it('Creates a new page with 3 Slate blocks', () => {
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
