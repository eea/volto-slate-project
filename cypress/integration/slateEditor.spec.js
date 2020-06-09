// TODO: remake this file and test it

cy.getEditor('[data-testid=slateEditor1] [contenteditable]').typeInSlate(
  'Some input text ',
);

cy.getEditor('[data-testid=slateEditor2] [contenteditable]')
  .clearInSlate()
  .typeInSlate('http://httpbin.org/status/409');
