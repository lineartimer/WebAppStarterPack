import { render, screen } from '@testing-library/react';
import Footer from './footer';

describe('Footer Component', () => {
  test('renders copyright notice with current year', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(`Copyright © ${currentYear}, Whoever.`)).toBeInTheDocument();
  });
});