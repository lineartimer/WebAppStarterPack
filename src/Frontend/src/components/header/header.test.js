import { render, screen } from '@testing-library/react';
import Header from './header'; 
import { isMobile } from '../../lib/utils';

// Only test if child components are rendered by Header, not how they are rendered
jest.mock('../logo/logo', () => () => <div data-testid="logo">MockedLogo</div>);
jest.mock('../navigation/navigation', () => () => <div data-testid="navigation">MockedNavigation</div>);
jest.mock('../user/user', () => () => <div data-testid="user">MockedUser</div>);

// Mock the isMobile utility
jest.mock('../../lib/utils', () => ({
  isMobile: jest.fn(),
}));

describe('Header Component', () => {
  describe('Desktop View', () => {
    beforeEach(() => {
      isMobile.mockReturnValue(false);
    });

    test('renders Logo, Navigation, and User components', () => {
      render(<Header />);

      expect(screen.getByTestId('logo')).toBeInTheDocument();
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
      expect(screen.getByTestId('user')).toBeInTheDocument();
    });
  });

  describe('Mobile View', () => {
    beforeEach(() => {
      isMobile.mockReturnValue(true);
    });

    test('renders Logo and User components', () => {
      render(<Header />);

      expect(screen.getByTestId('logo')).toBeInTheDocument();
      expect(screen.getByTestId('user')).toBeInTheDocument();
    });

    test('does not render Navigation component', () => {
      render(<Header />);
      
      expect(screen.queryByTestId('navigation')).not.toBeInTheDocument();
    });
  });
});