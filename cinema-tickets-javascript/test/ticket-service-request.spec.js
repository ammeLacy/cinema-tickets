import TicketService from '../src/pairtest/TicketService';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest';

describe('TicketService', () => {
  describe('PurchaseTickets', () => {
    it('should throw an error if account ID is undefined', () => {
      const service = new TicketService();
      expect(() => {
        service.purchaseTickets(new TicketTypeRequest('ADULT', 5));
      }).toThrow('Invalid account id');
    });
  });
});