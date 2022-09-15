import TicketService from '../src/pairtest/TicketService';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest';

describe('TicketService', () => {
  describe('PurchaseTickets', () => {
    it('should throw an error if account ID is undefined', () => {
      const service = new TicketService();
      expect(() => {
        service.purchaseTickets(undefined, new TicketTypeRequest('ADULT', 5));
      }).toThrow('Invalid account id');
    });
    it('should throw an error if less than 2 arguements are passed to it', () => {
      const service = new TicketService();
      expect(() => {
        service.purchaseTickets(new TicketTypeRequest('ADULT', 5));
      }).toThrow('Insufficient arguements');
    });
  });
});