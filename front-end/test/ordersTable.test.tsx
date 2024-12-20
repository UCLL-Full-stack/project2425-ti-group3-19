import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OrderTable from '../components/orderTableAll';
import { Order } from '@/types';

// Sample order data for testing
const sampleOrders: Order[] = [
  {
    id: 1,
    orderDate: '2024-12-20',
    product: 'Subscription',
    price: 50.0,
    orderReferentie: 'ORD123',
    user: {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    },
  },
  {
    id: 2,
    orderDate: '2024-12-19',
    product: 'Ticket',
    price: 30.0,
    orderReferentie: 'ORD124',
    user: {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    },
  },
];

// Test 1: When orders are available, the table should render the orders
test('displays orders when orders are provided', () => {
  render(<OrderTable orders={sampleOrders} />);

  // Check if order details are rendered in the table
  expect(screen.getByText('1')).toBeInTheDocument(); // Check for Order ID 1
  expect(screen.getByText('2')).toBeInTheDocument(); // Check for Order ID 2
  expect(screen.getByText('Subscription')).toBeInTheDocument(); // Check for Product 'Subscription'
  expect(screen.getByText('50.00 USD')).toBeInTheDocument(); // Check for Price '50.00 USD'
  expect(screen.getByText('ORD123')).toBeInTheDocument(); // Check for Order Reference 'ORD123'
  expect(screen.getAllByText(/John Doe/i).length).toBe(2);
});

// Test 2: When no orders are provided, the "No orders available." message should be displayed
test('displays message when no orders are provided', () => {
  render(<OrderTable orders={[]} />);

  // Check if the alert message is displayed
  expect(screen.getByText(/No orders available/i)).toBeInTheDocument();
});
