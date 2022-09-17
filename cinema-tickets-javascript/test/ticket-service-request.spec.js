import TicketService from '../src/pairtest/TicketService';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest';

describe('TicketService', () => {
  describe('PurchaseTickets', () => {
      it('should throw an error if less than 2 arguements are passed to it', () => {
      const service = new TicketService();
      expect(() => {
        service.purchaseTickets(new TicketTypeRequest('ADULT', 5));
      }).toThrow('Insufficient arguements');
      });
      it('should throw an error if account ID is undefined', () => {
      const service = new TicketService();
      expect(() => {
        service.purchaseTickets(undefined, new TicketTypeRequest('ADULT', 5));
      }).toThrow('Invalid account id');
      });
      it('should throw an error if account ID is less than 1', () => {
      const service = new TicketService();
      expect(() => {
        service.purchaseTickets(-1, new TicketTypeRequest('ADULT', 5));
      }).toThrow('Invalid account id');
      });
      it('should throw an error if account ID is not a number', () => {
      const service = new TicketService();
      expect(() => {
        service.purchaseTickets('1', new TicketTypeRequest('ADULT', 5));
      }).toThrow(TypeError);      
      });
      it('should provide an error message when account ID is not a number', () => {
      const service = new TicketService();
      expect(() => {
        service.purchaseTickets('1', new TicketTypeRequest('ADULT', 5));
      }).toThrow('Invalid account id');      
      });
      it('should throw an error if there are more than 20 tickets requestd', () => {
      const service = new TicketService();
      expect(() => {
        service.purchaseTickets(
          42,
          new TicketTypeRequest('ADULT', 19),
          new TicketTypeRequest('CHILD', 5)
        );
      }).toThrow('Max of 20 tickets at a time');
      });
      it('should throw an error if infant tickets are purchased with out an adult ticket', () => {
      const service = new TicketService();
      expect(() => {
        service.purchaseTickets(
          42,
          new TicketTypeRequest('INFANT', 5)
        );
      }).toThrow('Infant or child tickets cannot be purchased without an Adult ticket');      
      });
      it('should throw an error if infant tickets are purchased with out an adult ticket', () => {
      const service = new TicketService();
      expect(() => {
        service.purchaseTickets(
          42,
          new TicketTypeRequest('CHILD', 5)
        );
      }).toThrow('Infant or child tickets cannot be purchased without an Adult ticket');      
      });
    });
  });
