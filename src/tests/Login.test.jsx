import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import Login from '../pages/Login';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('Login Component', () => {
  it('renders email and password inputs and submits correctly', async () => {
    axios.post.mockResolvedValue({ data: { token: 'mock-token' } }); // mock response

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Find input fields
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getAllByRole('button', { name: /login/i })[0];

    // Fill out form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit form
    fireEvent.click(loginButton);

    // Wait for async submission
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/login'),
        {
          email: 'test@example.com',
          password: 'password123',
        }
      );
    });
  });
});

