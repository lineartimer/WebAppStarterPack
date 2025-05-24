import { render, screen } from '@testing-library/react';
import Logo from './logo';

describe('Logo Component', () => {
  test('renders logo', () => {
    render(<Logo />);

    expect(screen.getByText('Web App')).toBeInTheDocument();
    expect(screen.getByText('Starter Pack')).toBeInTheDocument();
  });
});