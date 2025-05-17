import { render, screen } from '@testing-library/react';
import Logo from './Logo';

describe('Logo', () => {
  test('renders Logo', () => {
    render(<Logo />);
  });
});
