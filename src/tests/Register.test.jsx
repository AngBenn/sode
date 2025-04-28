import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import Register from '../src/pages/Register';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

vi.mock('axios');

describe('Register Component', () => {
  it('submits registration form with user data', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Registration successful' } });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    // Use the actual data-testids from your form where available
    fireEvent.change(screen.getByPlaceholderText('First Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByTestId('username-input'), { // Last Name input
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), {
      target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByTestId('register-button'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/register'),
        {
          first_name: 'John',
          last_name: 'Doe',
          email: 'test@example.com',
          phone: '1234567890',
          password: 'password123',
          confirmPassword: 'password123',
        }
      );
    });
  });
});