import { slateBefore } from '../../support';

if (Cypress.env('API') !== 'guillotina') {
  // NB! please run this once before the rest of the tests in a testing session

  describe('Initial setup', () => {
    it('does initial setup', () => {
      slateBefore();
    });
  });
}
