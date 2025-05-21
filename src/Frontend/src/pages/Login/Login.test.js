import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import Login from "./Login";
import { callEndPoint } from '../../services/http';
import { frontend } from '../../config/config';
import { isMobile } from '../../utils/utils';

const mockNavigateFunc = jest.fn();

jest.mock('../../utils/utils', () => ({
    isMobile: jest.fn()
}));

jest.mock('../../services/http', () => ({
    callEndPoint: jest.fn(() => Promise.resolve({})),
    httpMethods: {
        Get: 'GET',
        Post: 'POST'
    },
    responseStatus: {
        Ok: 200,
        UnAuthorized: 401
    }
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

describe('Login Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        isMobile.mockReturnValue(false);
        mockLocalStorage(null, null);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('show/hide password button works on mobile', () => {
        isMobile.mockReturnValue(true);
        render(<Login />);

        const showHideButton = screen.getByRole('button', { name: 'Show' });

        testPasswordVisibility(false);
        
        fireEvent.click(showHideButton);
        testPasswordVisibility(true);
        
        fireEvent.click(showHideButton);
        testPasswordVisibility(false);
    });

    test('error shown when username is missing', async () => {
        render(<Login />);

        const creds = getCredentials();
        login(creds, true, false);

        expect(screen.getByText(frontend.errorMessages.userNameMissingError)).toBeInTheDocument();
    });

    test('error shown when password is missing', async () => {
        render(<Login />);

        const creds = getCredentials();
        login(creds, false, true);

        expect(screen.getByText(frontend.errorMessages.passwordMissingError)).toBeInTheDocument();
    });

    test('log in fails with invalid credentials', async () => {
        testLogin(false);
    });

    test('log in succeeds with valid credentials for non-admin user', async () => {
        testLogin(true, false);
    });

    test('log in succeeds with valid credentials for admin user', async () => {
        testLogin(true, true);
    });

    test('show/hide password button works on desktop', () => {
        isMobile.mockReturnValue(false);
        render(<Login />);
        const showHideButton = screen.getByRole('button', { name: 'Show' });

        testPasswordVisibility(false);

        fireEvent.mouseDown(showHideButton);
        testPasswordVisibility(true);

        fireEvent.mouseUp(showHideButton);
        testPasswordVisibility(false);
    });

    const getCredentials = (isValid = true, isAdmin = false) => {
        if(isValid)
        {
            return {
                username: `user${isAdmin ? '3' : '1'}`,
                password: `password${isAdmin ? '3' : '1'}`,
            };
        } else {
            return {
                username: 'WrongUser',
                password: 'InvalidPassword'
            }
        }
    }

    const login = (credentials, usernameMissing = false, passwordMissing = false) => {
        if(!usernameMissing) {
            const usernameInput = screen.queryByPlaceholderText('Username');
            fireEvent.change(usernameInput, {target: {value: credentials.username}});
        }

        if(!passwordMissing) {
            const passwordInput = screen.queryByPlaceholderText('Password');
            fireEvent.change(passwordInput, {target: {value: credentials.password}});
        }

        const loginButton = screen.getByRole('button', { name: 'Sign in' });
        fireEvent.click(loginButton);
    }

    const testLogin = async (isValid, isAdmin = false) => {
        render(<Login />);

        callEndPoint.mockReturnValue({
            status: isValid ? 200 : 401,
            payload: isValid ? {
                Role: isAdmin ? 'Admin' : 'User'
            } : null
        });

        const creds = getCredentials(isValid, isAdmin);
        login(creds);

        expect(screen.getByTestId('loadingScreen')).toBeInTheDocument();
        expect(screen.getByTestId('spinner')).toBeInTheDocument();

        await waitFor(() => {
            expect(callEndPoint).toHaveBeenCalledWith('/Auth/Login', 'POST', null, creds);
        });

        callEndPoint.mockReturnValue({
            status: 200,
            payload: {
                xcsrf: 'ThisIsAnXcsrfTokenForTestingPuroses'
            }
        });

        await waitFor(() => {
            expect(callEndPoint).toHaveBeenCalledWith('/Auth/GetXcsrfToken', 'GET');
        });
        expect(screen.getByTestId('loadingScreen')).not.toBeInTheDocument();
        expect(screen.getByTestId('spinner')).not.toBeInTheDocument();

        if(isValid) {
            expect(mockNavigateFunc).toHaveBeenCalledWith('/');
        } else {
            expect(screen.getByText(frontend.errorMessages.invalidUserNameOrPasswordError)).toBeInTheDocument();
        }
    }

    const testPasswordVisibility = (isShown) => {
        const passwordInput = screen.getByPlaceholderText('Password');
        
        if(isShown) {
            expect(passwordInput).toHaveAttribute('type', 'text');
            expect(screen.getByRole('button', { name: 'Hide' })).toBeInTheDocument();
            expect(passwordInput).toHaveAttribute('type', 'text');
        } else {
            expect(passwordInput).toHaveAttribute('type', 'password');
            expect(screen.getByRole('button', { name: 'Show' })).toBeInTheDocument();
            expect(passwordInput).toHaveAttribute('type', 'password');
        }
    }
});