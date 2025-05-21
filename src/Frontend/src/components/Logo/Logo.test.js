import { render, screen } from '@testing-library/react';
import Logo from './Logo';

describe('Logo', () => {
  test('renders Logo', () => {
    render(<Logo />);

    expect(screen.getByText('Web App')).toBeInTheDocument();
    expect(screen.getByText('Starter Pack')).toBeInTheDocument();
  });
});