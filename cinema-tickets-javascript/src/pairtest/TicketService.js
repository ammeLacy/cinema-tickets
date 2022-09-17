import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

export default class TicketService {
  
  #paymentService = new TicketPaymentService();
  #seatReservationService = new SeatReservationService();
  
  /**
   * Should only have private methods other than the one below.
   */
  
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
  }
  /**
   * Added logic due to business requirement that infantsare not allocated a seat as they s
   * sit on an adults  lap. 
   * Throw error at this point as have the
   * information to avoid unecessary calculation
   * and calls to  payment or seat reservation services.
   */
  
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
    if (ticketsPerCategory.ADULT < ticketsPerCategory.INFANT) {
      throw new InvalidPurchaseException('More infants than adults');
    }
    return ticketsPerCategory;
  }
  
  _calculateTotalTicketCost(ticketsPerCategory) {
    const ticketPrices = {
      infant: 0,
      child: 10,
      adult: 20
    };

    const totalAdultTicketPrice = ticketPrices.adult * ticketsPerCategory.ADULT;
    const totalChildPrice = ticketPrices.child * ticketsPerCategory.CHILD;
    const totalInfantPrice = ticketPrices.infant * ticketsPerCategory.INFANT;

    const totalTicketPrice = totalAdultTicketPrice + totalChildPrice + totalInfantPrice;
    return totalTicketPrice;
  }
  
  _calculateTotalNumberOfSeats(ticketsPerCategory){
    const totalSeatsToReserve = ticketsPerCategory.ADULT + ticketsPerCategory.CHILD;
    if (totalSeatsToReserve === 0) {
      throw new InvalidPurchaseException('Zero tickets have been requested');
    }
    else {
      return totalSeatsToReserve;
    }
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException
    
    this._areSufficientParams(ticketTypeRequests);
    this._isValidAccountId(accountId);  
    this._validateTickets(ticketTypeRequests);
    
    const ticketsPerCategory = this._groupAndCountTickets(ticketTypeRequests);
    
    const totalTicketPrice = this._calculateTotalTicketCost(ticketsPerCategory);   
    
    this.#paymentService.makePayment(accountId, totalTicketPrice)
    
    const totalSeatsToReserve = this._calculateTotalNumberOfSeats(ticketsPerCategory);
  
    this.#seatReservationService.reserveSeat(accountId, totalSeatsToReserve);  
  }
}
