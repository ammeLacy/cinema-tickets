import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest';

describe('TicketTypeRequest', () => {
  it('TicketTypeRequest should be an immutable object', () => {
    const ticket = new TicketTypeRequest('ADULT', 1);
    expect(Object.isExtensible(ticket)).toEqual(false);
  });
});