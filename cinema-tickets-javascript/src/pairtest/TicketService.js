import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  
  _areSufficientParams(ticketTypeRequests) {
    if (ticketTypeRequests.length === 0) {
      throw new InvalidPurchaseException('Insufficient arguements');
    }
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException
    
    this._areSufficientParams(ticketTypeRequests);
    if (!Number.isInteger(accountId) ||!accountId || accountId < 1 ) {
      throw new InvalidPurchaseException('Invalid account id');
    }
  }

 
}
