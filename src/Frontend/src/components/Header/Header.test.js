import { render, screen } from '@testing-library/react';
import Header from './Header'; 

// Only test if child components are rendered by Header, not how they are rendered.
jest.mock('../../components/Logo/Logo', () => () => <div data-testid="logo">MockedLogo</div>);
jest.mock('../../components/Navigation/Navigation', () => () => <div data-testid="navigation">MockedNavigation</div>);
jest.mock('../../components/User/User', () => () => <div data-testid="user">MockedUser</div>);

// Mock the isMobile utility
jest.mock('../../utils/utils', () => ({
  isMobile: jest.fn(),
}));

// Import the mocked isMobile to control it in tests
import { isMobile } from '../../utils/utils';

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

  afterEach(() => {
    jest.clearAllMocks();
  });
});
