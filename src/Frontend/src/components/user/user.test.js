import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import User from './user';
import { isMobile } from '../../lib/utils';
import { callApi } from '../../lib/client';

jest.mock('../../lib/utils', () => ({
    isMobile: jest.fn(),
    httpMethods: { Post: 'POST' }
}));

jest.mock('../../lib/client', () => ({
    callApi: jest.fn(() => Promise.resolve({}))
}));

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigateFunc,
}));

const mockLocalStorage = (username, role, xcsrf) => {
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockImplementation((key) => {
        if (key === 'username') {
            return username;
        }

        if (key === 'role') {
            return role;
        }

        if (key === 'xcsrf') {
            return xcsrf;
        }

        return null;
    });
    
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(jest.fn());
    jest.spyOn(Storage.prototype, 'clear').mockImplementation(jest.fn());
};

describe('User Component', () => {
    beforeEach(() => {
        isMobile.mockReturnValue(false);
    });

    describe('Desktop View', () => {
        test('renders Login link when not logged in', () => {
            mockLocalStorage(null, null, null);
            render(<User />);

            expect(screen.getByText('Login')).toBeInTheDocument();
            expect(screen.queryByText('Logout')).not.toBeInTheDocument();
        });

        test('renders username and shows/hides user window on click when logged in', () => {
            mockLocalStorage('user1', 'User', 'ThisIsAnXcsrfTokenForTestingPurposes');
            render(<User />);

            const usernameLink = screen.getByText('user1');

            expect(usernameLink).toBeInTheDocument();
            expect(screen.queryByText('Logout')).not.toBeInTheDocument();

            fireEvent.click(usernameLink);

            expect(screen.getByText('Logout')).toBeInTheDocument();
            expect(screen.queryByText(/Role/i)).not.toBeInTheDocument();
            
            fireEvent.click(usernameLink);
            expect(screen.queryByText('Logout')).not.toBeInTheDocument();
        });

        test('renders Admin role and logout when logged in as admin', () => {
            mockLocalStorage('user3', 'Admin', 'ThisIsAnXcsrfTokenForTestingPurposes');
            render(<User />);

            const usernameLink = screen.getByText('user3');
            fireEvent.click(usernameLink);

            expect(screen.getByText(/Role: Admin/i)).toBeInTheDocument();
            expect(screen.getByText('Logout')).toBeInTheDocument();
        });

        test('renders logout when logged in as common user', () => {
            mockLocalStorage('user1', 'User', 'ThisIsAnXcsrfTokenForTestingPurposes');
            render(<User />);

            const usernameLink = screen.getByText('user1');
            fireEvent.click(usernameLink);

            expect(screen.getByText(/user1/i)).toBeInTheDocument();
            expect(screen.getByText('Logout')).toBeInTheDocument();
        });

        test('calls logout api on logout', async () => {
            mockLocalStorage('user1', 'User', 'ThisIsAnXcsrfTokenForTestingPurposes');
            render(<User />);

            fireEvent.click(screen.getByText('user1'));
            const logoutButton = screen.getByText('Logout');
            
            fireEvent.click(logoutButton);
            await waitFor(() => {
                expect(callApi).toHaveBeenCalledWith('/api/logout', 'POST', 'ThisIsAnXcsrfTokenForTestingPurposes');
            });

            expect(localStorage.clear).toHaveBeenCalled();
        });

        test('closes user window on clicking outside', () => {
            mockLocalStorage('user1', 'User', 'ThisIsAnXcsrfTokenForTestingPurposes');
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

    describe('Mobile View', () => {
        beforeEach(() => {
            isMobile.mockReturnValue(true);
        });

        test('renders hamburger icon and shows/hides user window on click', () => {
            mockLocalStorage('user1', 'User', null);
            render(<User />);

            const hamburgerButton = screen.getByText('☰');

            expect(hamburgerButton).toBeInTheDocument();
            expect(screen.queryByText('Logout')).not.toBeInTheDocument();

            fireEvent.click(hamburgerButton);

            expect(screen.getByText('Logout')).toBeInTheDocument();
            expect(screen.getByText('user1')).toBeInTheDocument();
            
            const closeButton = screen.getByText('✖');
            fireEvent.click(closeButton);

            expect(screen.queryByText('Logout')).not.toBeInTheDocument();
        });

        test('renders Login link in mobile menu when not logged in', () => {
            mockLocalStorage(null, null, null);
            render(<User />);

            fireEvent.click(screen.getByText('☰'));

            expect(screen.getByText('Login')).toBeInTheDocument(0);
        });
        
        test('renders Admin role in mobile menu when logged in as Admin', () => {
            mockLocalStorage('user3', 'Admin', 'ThisIsAnXcsrfTokenForTestingPurposes');
            render(<User />);

            fireEvent.click(screen.getByText('☰'));

            expect(screen.getByText(/Role: Admin/i)).toBeInTheDocument();
            expect(screen.getByText('Logout')).toBeInTheDocument();
        });
    });
});