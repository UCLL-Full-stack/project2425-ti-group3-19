import { Ticket } from "../model/ticket"; 

test('given: valid ticket data, when: ticket is created, then: ticket properties are set correctly', () => {
    // given
    const ticket = new Ticket({
        date: new Date('2024-12-20T10:00:00'),
        price: 100,
        startStation: 'Station A',
        desStation: 'Station B',
        orderId: '12345',
    });

    // when

    // then
    expect(ticket.getDate()).toEqual(new Date('2024-12-20T10:00:00'));
    expect(ticket.getPrice()).toEqual(100);
    expect(ticket.getStartStation()).toEqual('Station A');
    expect(ticket.getDesStation()).toEqual('Station B');
    expect(ticket.getOrderId()).toEqual('12345');
});

test('given: missing optional ticket ID, when: ticket is created, then: ID is undefined', () => {
    // given
    const ticket = new Ticket({
        date: new Date('2024-12-20T10:00:00'),
        price: 100,
        startStation: 'Station A',
        desStation: 'Station B',
        orderId: '12345',
    });

    // when

    // then
    expect(ticket.getId()).toBeUndefined();
});

test('given: invalid ticket data, when: missing date, then: throws error', () => {
    // given
    const incompleteTicketData = () => new Ticket({
        date: <any> '',
        price: 100,
        startStation: 'Station A',
        desStation: 'Station B',
        orderId: '12345',
    });

    // when & then
    expect(incompleteTicketData).toThrow('Date is required and must be a valid Date object');
});

test('given: invalid ticket data, when: price is zero or negative, then: throws error', () => {
    // given
    const incompleteTicketData = () => new Ticket({
        date: new Date('2024-12-20T10:00:00'),
        price: 0,
        startStation: 'Station A',
        desStation: 'Station B',
        orderId: '12345',
    });

    // when & then
    expect(incompleteTicketData).toThrow('Price must be a positive number');
});

test('given: invalid ticket data, when: missing start station, then: throws error', () => {
    // given
    const incompleteTicketData = () => new Ticket({
        date: new Date('2024-12-20T10:00:00'),
        price: 100,
        startStation: '',
        desStation: 'Station B',
        orderId: '12345',
    });

    // when & then
    expect(incompleteTicketData).toThrow('Start Station is required');
});

test('given: invalid ticket data, when: missing destination station, then: throws error', () => {
    // given
    const incompleteTicketData = () => new Ticket({
        date: new Date('2024-12-20T10:00:00'),
        price: 100,
        startStation: 'Station A',
        desStation: '',
        orderId: '12345',
    });

    // when & then
    expect(incompleteTicketData).toThrow('Destination Station is required');
});

test('given: invalid ticket data, when: missing order ID, then: throws error', () => {
    // given
    const incompleteTicketData = () => new Ticket({
        date: new Date('2024-12-20T10:00:00'),
        price: 100,
        startStation: 'Station A',
        desStation: 'Station B',
        orderId: '',
    });

    // when & then
    expect(incompleteTicketData).toThrow('Order ID is required');
});

test('given: missing optional createdAt and updatedAt, when: ticket is created, then: these properties are undefined', () => {
    // given
    const ticket = new Ticket({
        date: new Date('2024-12-20T10:00:00'),
        price: 100,
        startStation: 'Station A',
        desStation: 'Station B',
        orderId: '12345',
    });

    // when

    // then
    expect(ticket.getCreatedAt()).toBeUndefined();
    expect(ticket.getUpdatedAt()).toBeUndefined();
});

test('given: two identical tickets, when: comparing tickets, then: they are equal', () => {
    // given
    const ticket1 = new Ticket({
        date: new Date('2024-12-20T10:00:00'),
        price: 100,
        startStation: 'Station A',
        desStation: 'Station B',
        orderId: '12345',
    });

    const ticket2 = new Ticket({
        date: new Date('2024-12-20T10:00:00'),
        price: 100,
        startStation: 'Station A',
        desStation: 'Station B',
        orderId: '12345',
    });

    // when

    // then
    expect(ticket1.equals(ticket2)).toBe(true);
});

test('given: two different tickets, when: comparing tickets, then: they are not equal', () => {
    // given
    const ticket1 = new Ticket({
        date: new Date('2024-12-20T10:00:00'),
        price: 100,
        startStation: 'Station A',
        desStation: 'Station B',
        orderId: '12345',
    });

    const ticket2 = new Ticket({
        date: new Date('2024-12-21T10:00:00'),
        price: 120,
        startStation: 'Station C',
        desStation: 'Station D',
        orderId: '67890',
    });

    // when

    // then
    expect(ticket1.equals(ticket2)).toBe(false);
});
