import TicketService from '../src/pairtest/TicketService';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest';
import TicketPaymentService from '../src/thirdparty/paymentgateway/TicketPaymentService';
import SeatReservationService from '../src/thirdparty/seatbooking/SeatReservationService';

jest.mock('../src/thirdparty/paymentgateway/TicketPaymentService');
jest.mock('../src/thirdparty/seatbooking/SeatReservationService');

beforeEach(() => {
  TicketPaymentService.mockClear();
  SeatReservationService.mockClear();  
});

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
      it('should throw an error if child tickets are purchased with out an adult ticket', () => {
      const service = new TicketService();
      expect(() => {
        service.purchaseTickets(
          42,
          new TicketTypeRequest('CHILD', 5)
        );
      }).toThrow('Infant or child tickets cannot be purchased without an Adult ticket');      
      });
      it('should throw an error if there are more infant tickets than adults', () => {
        const service = new TicketService();
        expect(() => {
          service.purchaseTickets(
            42,
            new TicketTypeRequest('ADULT', 1),
            new TicketTypeRequest('INFANT', 2)
          );
        }).toThrow('More infants than adults');
      });
      it('should call the ticket payment service with the account Id and correct amount for the requested tickets', () => {
        const service = new TicketService();
        service.purchaseTickets(42, 
        new TicketTypeRequest('ADULT', 2),
        new TicketTypeRequest('CHILD', 3),
        new TicketTypeRequest('INFANT', 1)
        )
        const mockTSInstance = TicketPaymentService.mock.instances[0];
        const mockMakePayment = mockTSInstance.makePayment;
        expect(mockMakePayment).toHaveBeenCalledTimes(1);
        expect(mockMakePayment).toHaveBeenCalledWith(42,70);
      });
      it('should call the seat reservation service with the account Id and correct amount of tickets', () => {
        const service = new TicketService();
        service.purchaseTickets(42, new TicketTypeRequest('ADULT', 2),
        new TicketTypeRequest('CHILD', 3),
        new TicketTypeRequest('INFANT', 1)
        )
        const mockSRInstance = SeatReservationService.mock.instances[0];
        const mockReserveSeat = mockSRInstance.reserveSeat;
        expect(mockReserveSeat).toHaveBeenCalledTimes(1);
        expect(mockReserveSeat).toHaveBeenCalledWith(42,5);
      });
      it('should throw an error if total tickets equals 0', () => {
        const service = new TicketService();
        expect(() => {
          service.purchaseTickets(
            42,
            new TicketTypeRequest('ADULT', 0),
            new TicketTypeRequest('CHILD', 0)
          );
        }).toThrow('Zero tickets have been requested');
      });
    });
  });
