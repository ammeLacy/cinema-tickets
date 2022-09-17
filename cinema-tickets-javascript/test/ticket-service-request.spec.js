import TicketService from '../src/pairtest/TicketService';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest';
import TicketPaymentService from '../src/thirdparty/paymentgateway/TicketPaymentService'

jest.mock('../src/thirdparty/paymentgateway/TicketPaymentService')

beforeEach(() => {
  TicketPaymentService.mockClear();
});
/*
import SoundPlayer from './sound-player';
import SoundPlayerConsumer from './sound-player-consumer';
jest.mock('./sound-player'); // SoundPlayer is now a mock constructor

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  SoundPlayer.mockClear();
});

it('We can check if the consumer called the class constructor', () => {
  const soundPlayerConsumer = new SoundPlayerConsumer();
  expect(SoundPlayer).toHaveBeenCalledTimes(1);
});
*/

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
      it('should call the ticket payment service with the account Id and correct amount for therequested tickets', () => {
        const service = new TicketService();
        service.purchaseTickets(42, new TicketTypeRequest('ADULT', 2),
        new TicketTypeRequest('CHILD', 3),
        new TicketTypeRequest('INFANT', 1)
        )
        const mockTSInstance = TicketPaymentService.mock.instances[0];
        const mockMethod = mockTSInstance.makePayment;
        expect(mockMethod).toHaveBeenCalledTimes(1);
      });
    });
  });

