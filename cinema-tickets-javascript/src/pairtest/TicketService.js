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
  
  _isValidAccountId(accountId) {
    if (!Number.isInteger(accountId) || !accountId || accountId < 1) {
      throw new TypeError('Invalid account id');
    }
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException
    
    this._areSufficientParams(ticketTypeRequests);
    this._isValidAccountId(accountId);
    
    let totalNumberOfTickets = 0;
    const ticketTypes = [];
    
    ticketTypeRequests.forEach((ticket) => {totalNumberOfTickets+= ticket.getNoOfTickets();
      ticketTypes.push(ticket.getTicketType());
    }) 

    
    if (totalNumberOfTickets > 20) {
      throw new InvalidPurchaseException('Max of 20 tickets at a time');
    }
    if (!ticketTypes.includes('ADULT')) {
      throw new InvalidPurchaseException('Infant or child tickets cannot be purchased without an Adult ticket');
    }
    
  }
}
