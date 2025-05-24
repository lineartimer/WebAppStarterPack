import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import Login from "./page";
import { callEndPoint } from '../../lib/http';
import { frontend } from '../../lib/config';
import { isMobile } from '../../lib/utils';

jest.mock('../../lib/utils', () => ({
    isMobile: jest.fn()
}));

jest.mock('../../lib/http', () => ({
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
};

delete window.location;
window.location = { href: '' };

describe('Login Page', () => {
    beforeEach(() => {
        isMobile.mockReturnValue(false);
        mockLocalStorage(null, null);
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
        await testLogin(false);
    });

    test('log in succeeds with valid credentials for non-admin user', async () => {
        await testLogin(true, false);
    });

    test('log in succeeds with valid credentials for admin user', async () => {
        await testLogin(true, true);
    });

    test('show/hide password button works on desktop', () => {
        render(<Login />);
        const showHideButton = screen.getByRole('button', { name: 'Show' });

        testPasswordVisibility(false);

        fireEvent.mouseDown(showHideButton);
        testPasswordVisibility(true);

        fireEvent.mouseUp(showHideButton);
        testPasswordVisibility(false);
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

        if(isValid) {
            expect(window.location.href).toBe('/');
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
            };
        }
    }
});