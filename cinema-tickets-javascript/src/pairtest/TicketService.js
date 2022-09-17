import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';

export default class TicketService {
  
  #paymentService = new TicketPaymentService();
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
  
  _validateTickets(ticketTypeRequests) {
    let totalNumberOfTickets = 0;
    const ticketTypes = [];

    ticketTypeRequests.forEach((ticket) => {
      totalNumberOfTickets += ticket.getNoOfTickets();
      ticketTypes.push(ticket.getTicketType());
    });


    if (totalNumberOfTickets > 20) {
      throw new InvalidPurchaseException('Max of 20 tickets at a time');
    }
    if (!ticketTypes.includes('ADULT')) {
      throw new InvalidPurchaseException('Infant or child tickets cannot be purchased without an Adult ticket');
    }
    
  /**
   * Added logic due to business requirement that infants
   * are not allocated a seat as they sit on an adults lap. 
   * Throw error at this point as have the information to
   * avoid unecessary calculation, and calls to 
   * payment or seat reservation services.
   */

    const ticketsPerCategory = {};
    ticketTypeRequests.forEach((ticket) => {
      if (ticketsPerCategory.hasOwnProperty(ticket.getTicketType())) {
        ticketsPerCategory[ticket.getTicketType()] += ticket.getNoOfTickets();
      }
      else {
        ticketsPerCategory[ticket.getTicketType()]=ticket.getNoOfTickets()
      }
    })
    if (ticketsPerCategory.ADULT < ticketsPerCategory.INFANT) {
      throw new InvalidPurchaseException('More infants than adults')
    }
  
    
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException
    
    this._areSufficientParams(ticketTypeRequests);
    this._isValidAccountId(accountId);  
    this._validateTickets(ticketTypeRequests);
    this.#paymentService.makePayment(accountId, 42)
  }

  
}
