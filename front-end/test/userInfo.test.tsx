import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserInfo from '../components/userInfo';
import '@testing-library/jest-dom';
import { User } from '@/types';

// Test when user data is available
test('displays user information when user is provided', () => {
    const user: User = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'Admin',
    };

    render(<UserInfo user={user} />);
    
    expect(screen.getByText(/Welcome, John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/Email:/)).toHaveTextContent('Email: john.doe@example.com');
    expect(screen.getByText(/Role:/)).toHaveTextContent('Role: Admin');
});

// Test when user data is not available
test('displays warning when user data is not available', () => {
    render(<UserInfo user={null} />);
    
    expect(screen.getByText(/User data is not available/)).toBeInTheDocument();
});
