import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  test('renders copyright notice with current year', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(`Copyright © ${currentYear}, Whoever.`)).toBeInTheDocument();
  });
});