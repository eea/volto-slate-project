/// <reference types="Cypress" />
/// <reference types="../support" />

// TODO: remake this file and test it

describe('Test that setup works', () => {
  beforeEach(function () {
    cy.visit('https://www.slatejs.org/examples/richtext');
  });

  it('Can type in Slate using helper commands', function () {
    cy.getEditor('[contenteditable=true]').clearAllInSlate();
    cy.getEditor('[contenteditable=true]').typeInSlate('Some text here');
  });
});
