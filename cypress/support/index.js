// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import 'cypress-plugin-tab';

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

//https://docs.cypress.io/guides/tooling/code-coverage.htm
import '@cypress/code-coverage/support';

export const createSlateBlock = (firstInPage = false) => {
  if (firstInPage) {
    // the first block is a draft block (.block-editor-text)
    cy.get('.block-editor-text').last().click();

    // click the add block button
    cy.get('.block-add-button:first').click();

    // Text section in block type selector
    cy.get('.accordion > :nth-child(3):first').click();

    // click the Slate block button (the first one is in the Most Used section, the last one is surely the good one)
    cy.get('button.ui.basic.icon.button.slate').last().click();
  } else {
    cy.get('.block-editor-slate').last().click();
  }

  return getSelectedSlateEditor();
};

export const createSlateBlocks = (arr) => {
  let fip = true;
  for (let i = 0; i < arr.length; ++i) {
    let x = arr[i];

    let b;
    if (i !== 0) {
      b = getSelectedSlateEditor();
    } else {
      b = createSlateBlock(fip);
    }

    if (x !== '') {
      b.typeInSlate(x);
    }

    if (i !== arr.length - 1) {
      b.lineBreakInSlate();
    }

    if (fip) {
      fip = false;
    }
  }
};

export const getAllSlateBlocks = () => {
  return cy.get('.block-editor-slate');
};

export const getSelectedSlateEditor = () => {
  return cy.get('.slate-editor.selected [contenteditable=true]');
};

export const getSelectedUneditableSlateEditor = () => {
  return cy.get('.slate-editor.selected'); // [contenteditable=true] fails sometimes
};

export const getSlateBlockPlaintext = (sb) => {
  return sb.invoke('text');
};

export const getSlateBlockValue = (sb) => {
  return sb.invoke('attr', 'data-slate-value').then((str) => {
    return typeof str === 'undefined' ? [] : JSON.parse(str);
  });
};

export const getSlateBlockSelection = (sb) => {
  return sb.invoke('attr', 'data-slate-selection').then((str) => {
    return str ? JSON.parse(str) : null;
  });
};

export const selectSlateNodeOfWord = (el) => {
  return cy.window().then((win) => {
    var event = new CustomEvent('Test_SelectWord', {
      detail: el[0],
    });
    win.document.dispatchEvent(event);
  });
};

export const createSlateBlockWithList = ({
  firstInPage = false,
  numbered,
  firstItemText,
  secondItemText,
}) => {
  let s1 = createSlateBlock(firstInPage);

  s1.typeInSlate(firstItemText + secondItemText);

  // select all contents of slate block
  // - this opens hovering toolbar
  cy.contains(firstItemText + secondItemText).then((el) => {
    selectSlateNodeOfWord(el);
  });

  cy.wait(1000);

  // TODO: do not hardcode these selectors:
  if (numbered) {
    // this is the numbered list option in the hovering toolbar
    cy.get('.slate-inline-toolbar .button-wrapper:nth-child(9)')
      .justVisible()
      .click();
  } else {
    // this is the bulleted list option in the hovering toolbar
    cy.get('.slate-inline-toolbar .button-wrapper:nth-child(10)')
      .justVisible()
      .click();
  }

  // move the text cursor
  const sse = getSelectedSlateEditor();
  sse.type('{leftarrow}');
  for (let i = 0; i < firstItemText.length; ++i) {
    sse.type('{rightarrow}');
  }

  // simulate pressing Enter
  getSelectedSlateEditor().lineBreakInSlate();

  return s1;
};

export const slateBefore = () => {
  // if I use these 2 calls as in https://github.com/plone/volto/blob/master/cypress/support/index.js the tests fail for sure
  cy.exec('yarn cy:test:fixture:teardown');
  cy.exec('yarn cy:test:fixture:setup');

  cy.autologin();
  cy.createContent({
    contentType: 'Document',
    contentId: 'my-page',
    contentTitle: 'My Page',
  });

  cy.visit('/my-page/edit');

  cy.waitForResourceToLoad('@navigation');
  cy.waitForResourceToLoad('@breadcrumbs');
  cy.waitForResourceToLoad('@actions');
  cy.waitForResourceToLoad('@types');
  cy.waitForResourceToLoad('my-page?fullobjects');
};

export const slateBeforeEach = () => {
  // TODO: do not autologin before each test, just once,
  // in slateBefore function, and run slateBefore just at the
  // beginning of the testing session.
  // cy.autologin();
  slateBefore();
  // cy.visit('/my-page/edit');
};
