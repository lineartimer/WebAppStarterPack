import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import User from './User';
import { isMobile } from '../../utils/utils';
import { callEndPoint } from '../../services/http';

const mockNavigateFunc = jest.fn();

jest.mock('../../utils/utils', () => ({
    isMobile: jest.fn(),
}));

jest.mock('../../services/http', () => ({
    callEndPoint: jest.fn(() => Promise.resolve({})),
    httpMethods: { Post: 'POST' }
}));

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigateFunc,
}));

const mockLocalStorage = (username, role) => {
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockImplementation((key) => {
        if (key === 'username') {
            return username;
        }

        if (key === 'role') {
            return role;
        }

        return null;
    });
    
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(jest.fn());
    jest.spyOn(Storage.prototype, 'clear').mockImplementation(jest.fn());
};

const originalLocation = window.location;
beforeAll(() => {
    delete window.location;
    window.location = { ...originalLocation, reload: jest.fn() };
});
afterAll(() => {
    window.location = originalLocation;
});

describe('User Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        isMobile.mockReturnValue(false);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Desktop View', () => {
        test('renders Login link when not logged in', () => {
            mockLocalStorage(null, null);
            render(<User />);

            expect(screen.getByText('Login')).toBeInTheDocument();
            expect(screen.queryByText('Logout')).not.toBeInTheDocument();
        });

        test('renders username and shows/hides user window on click when logged in', () => {
            mockLocalStorage('user1', 'User');
            render(<User />);

            const usernameLink = screen.getByText('user1');
            expect(usernameLink).toBeInTheDocument();
            expect(screen.queryByText('Logout')).not.toBeInTheDocument();

            fireEvent.click(usernameLink);
            expect(screen.getByText('Logout')).toBeInTheDocument();
            expect(screen.queryByText(/Role: User/i)).not.toBeInTheDocument();
            
            fireEvent.click(usernameLink);
            expect(screen.queryByText('Logout')).not.toBeInTheDocument();
        });

        test('renders Admin role and logout when logged in as Admin', () => {
            mockLocalStorage('user3', 'Admin');
            render(<User />);

            const usernameLink = screen.getByText('user3');
            fireEvent.click(usernameLink);

            expect(screen.getByText('Logout')).toBeInTheDocument();
            expect(screen.getByText(/Role: Admin/i)).toBeInTheDocument();
        });

        test('calls logout endpoint and navigates on logout', async () => {
            mockLocalStorage('user1', 'User');
            render(<User />);

            fireEvent.click(screen.getByText('user1'));
            const logoutButton = screen.getByText('Logout');
            
            fireEvent.click(logoutButton);
            await waitFor(() => {
                expect(callEndPoint).toHaveBeenCalledWith('/Auth/Logout', 'POST', null);
            });

            expect(localStorage.removeItem).toHaveBeenCalledWith('username');
            expect(localStorage.removeItem).toHaveBeenCalledWith('role');
            expect(localStorage.removeItem).toHaveBeenCalledWith('xcsrf');
            expect(mockNavigateFunc).toHaveBeenCalledWith('/');
            expect(window.location.reload).toHaveBeenCalled();
        });
    });

    describe('Mobile View', () => {
        beforeEach(() => {
            isMobile.mockReturnValue(true);
        });

        test('renders hamburger icon and shows/hides user window on click', () => {
            mockLocalStorage('mobileuser', 'User');
            render(<User />);

            const hamburgerButton = screen.getByText('☰');
            expect(hamburgerButton).toBeInTheDocument();
            expect(screen.queryByText('Logout')).not.toBeInTheDocument();

            fireEvent.click(hamburgerButton);
            expect(screen.getByText('Logout')).toBeInTheDocument();
            expect(screen.getByText('mobileuser')).toBeInTheDocument();
            
            const closeButton = screen.getByText('✖');
            fireEvent.click(closeButton);
            expect(screen.queryByText('Logout')).not.toBeInTheDocument();
        });

        test('renders Login link in mobile menu when not logged in', () => {
            mockLocalStorage(null, null);
            render(<User />);

            fireEvent.click(screen.getByText('☰'));
            expect(screen.getByText('Login')).toBeInTheDocument(0);
        });
        
        test('renders Admin role in mobile menu when logged in as Admin', () => {
            mockLocalStorage('user3', 'Admin');
            render(<User />);

            fireEvent.click(screen.getByText('☰'));
            expect(screen.getByText('Logout')).toBeInTheDocument();
            expect(screen.getByText(/Role: Admin/i)).toBeInTheDocument();
        });
    });

    test('closes user window on clicking outside', () => {
        mockLocalStorage('user1', 'User');
        render(
            <div>
                <div data-testid="outside">Outside Area</div>
                <User />
            </div>
        );

        fireEvent.click(screen.getByText('user1'));
        expect(screen.getByText('Logout')).toBeInTheDocument();

        fireEvent.mouseDown(screen.getByTestId('outside'));
        expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });
});