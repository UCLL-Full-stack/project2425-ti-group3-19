import ticketService from '../service/ticket.service'; // Import the service
import ticketRepository from '../repository/ticket.db'; // Import the mocked repository
import { Ticket } from '../model/ticket'; // Import the Ticket model

// Mock repository functions
jest.mock('../repository/ticket.db', () => ({
  saveTicket: jest.fn(),
  getAllTickets: jest.fn(),
  getTicketById: jest.fn(),
  findTicketsByUserId: jest.fn(),
}));

describe('ticketService', () => {
  const mockTicketData = {
    id: 1,
    date: new Date(),
    price: 100,
    startStation: 'Station A',
    desStation: 'Station B',
    orderId: 'order-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTicket = new Ticket(mockTicketData);

  // Mock repository methods
  beforeEach(() => {
    (ticketRepository.saveTicket as jest.Mock).mockResolvedValue(mockTicket);
    (ticketRepository.getAllTickets as jest.Mock).mockResolvedValue([mockTicket]);
    (ticketRepository.getTicketById as jest.Mock).mockResolvedValue(mockTicket);
    (ticketRepository.findTicketsByUserId as jest.Mock).mockResolvedValue([mockTicket]);
  });

  // Test createTicket
  describe('createTicket', () => {
    it('should create a new ticket and return it', async () => {
      const ticketData = {
        date: new Date(),
        price: 100,
        startStation: 'Station A',
        desStation: 'Station B',
        orderId: 'order-1',
      };

      const createdTicket = await ticketService.createTicket(new Ticket(ticketData));

      expect(createdTicket).toEqual(mockTicket);
      expect(ticketRepository.saveTicket).toHaveBeenCalledWith(expect.objectContaining(ticketData));
    });
  });

  // Test getAllTickets
  describe('getAllTickets', () => {
    it('should return an array of tickets', async () => {
      const tickets = await ticketService.getAllTickets();

      expect(tickets).toEqual([mockTicket]);
      expect(ticketRepository.getAllTickets).toHaveBeenCalledTimes(1);
    });
  });

  // Test getTicketById
  describe('getTicketById', () => {
    it('should return the ticket if it exists', async () => {
      const ticket = await ticketService.getTicketById(1);

      expect(ticket).toEqual(mockTicket);
      expect(ticketRepository.getTicketById).toHaveBeenCalledWith({ id: 1 });
    });
  });

  // Test getTicketsByUserId
  describe('getTicketsByUserId', () => {
    it('should return an array of tickets for a user', async () => {
      const userId = 'user1';
      const tickets = await ticketService.getTicketsByUserId(userId);

      expect(tickets).toEqual([mockTicket]);
      expect(ticketRepository.findTicketsByUserId).toHaveBeenCalledWith(userId);
    });
  });
});
