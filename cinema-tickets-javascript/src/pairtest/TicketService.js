import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

export default class TicketService {
  
  #paymentService = new TicketPaymentService();
  #seatReservationService = new SeatReservationService();
  
  
  constructor () {
    this.#paymentService = this.#paymentService;
    this.#seatReservationService = this.#seatReservationService;
  }
  
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
  
  /**
   * Added logic due to business requirement that infants are not allocated a seat as they
   * sit on an adults lap that number of infants is equal to or less than the number of adults.
   */
  _validateTickets(ticketsPerCategory) {
    if (ticketsPerCategory.ADULT < ticketsPerCategory.INFANT) {
      throw new InvalidPurchaseException('More infants than adults');
    }
    const totalNumberOfTickets = Object.values(ticketsPerCategory).reduce(
      (previousValue, currentValue) => previousValue + currentValue
    );
    const maxAllowedTickets = 20;
    if (totalNumberOfTickets > maxAllowedTickets) {
      throw new InvalidPurchaseException(`Max of ${maxAllowedTickets} tickets at a time`);
    }
    if (!ticketsPerCategory.hasOwnProperty('ADULT')) {
      throw new InvalidPurchaseException('Infant or child tickets cannot be purchased without an Adult ticket');
    } 
  }
  
  _groupAndCountTickets(ticketTypeRequests) {
    const ticketsPerCategory = {};
    ticketTypeRequests.forEach((ticket) => {
      if (ticketsPerCategory.hasOwnProperty(ticket.getTicketType())) {
        ticketsPerCategory[ticket.getTicketType()] += ticket.getNoOfTickets();
      }
      else {
        ticketsPerCategory[ticket.getTicketType()] = ticket.getNoOfTickets();
      }
    });
    return ticketsPerCategory;
  }
  
  _getOrZero(ticketsPerCategory, category) {
    if(ticketsPerCategory[category] === undefined) {
      return 0;
    }
    return ticketsPerCategory[category];
  }
  _calculateTotalTicketCost(ticketsPerCategory) {
    const ticketPrices = {
      infant: 0,
      child: 10,
      adult: 20
    };

    const totalAdultTicketPrice = ticketPrices.adult * this._getOrZero(ticketsPerCategory, 'ADULT');
    const totalChildPrice = ticketPrices.child * this._getOrZero(ticketsPerCategory, 'CHILD');
    const totalInfantPrice = ticketPrices.infant * this._getOrZero(ticketsPerCategory, 'INFANT');

    const totalTicketPrice = totalAdultTicketPrice + totalChildPrice + totalInfantPrice;
    return totalTicketPrice;
  }
  
  _calculateTotalNumberOfSeats(ticketsPerCategory){
    const totalSeatsToReserve = this._getOrZero(ticketsPerCategory, 'ADULT') + this._getOrZero(ticketsPerCategory, 'CHILD');
    if (totalSeatsToReserve === 0) {
      throw new InvalidPurchaseException('Zero tickets have been requested');
    }
    return totalSeatsToReserve;
  }

  /**
   * Should only have private methods other than the one below.
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException
    
    this._areSufficientParams(ticketTypeRequests);
    this._isValidAccountId(accountId);
    
    const ticketsPerCategory = this._groupAndCountTickets(ticketTypeRequests);
    this._validateTickets(ticketsPerCategory);
    
    const totalTicketPrice = this._calculateTotalTicketCost(ticketsPerCategory);   
    
    this.#paymentService.makePayment(accountId, totalTicketPrice)
    
    const totalSeatsToReserve = this._calculateTotalNumberOfSeats(ticketsPerCategory);
  
    this.#seatReservationService.reserveSeat(accountId, totalSeatsToReserve);  
  }
}
