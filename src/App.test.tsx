import React from 'react';
import { render, screen } from '@testing-library/react';
import DefaultMap from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
