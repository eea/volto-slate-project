import { slateBefore } from '../../support';

if (Cypress.env('API') !== 'guillotina') {
  describe('Initial setup', () => {
    it('does initial setup', () => {
      slateBefore();
    });
  });
}
