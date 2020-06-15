export const createSlateBlock = () => {
  cy.get('.block-editor-text').last().click();

  // click the add block button
  cy.get('.inner > .block > .ui > .icon').click();

  // Text section in block type selector
  cy.get('.accordion > :nth-child(3)').click();

  // click the Slate block button (the first one is in the Most Used section, the last one is surely the good one)
  cy.get('button.ui.basic.icon.button.slate').last().click();

  return getSelectedSlateEditor();
};

export const getSelectedSlateEditor = () => {
  return cy.get('.slate-editor.selected [contenteditable=true]');
};

export const getSlateBlockPlaintext = (sb) => {
  return sb.invoke('text');
};

export const getSlateBlockValue = (sb) => {
  return sb.invoke('attr', 'data-slate-value').then((str) => {
    return JSON.parse(str);
  });
};

export const slateBeforeEach = () => {
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
};
