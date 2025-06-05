import { render, screen, waitFor } from '@testing-library/react';
import { callApi } from '../../lib/client';

import Admin from "./page";

jest.mock('../../lib/client', () => ({
    callApi: jest.fn(() => Promise.resolve({}))
}));

const mockLocalStorage = (xcsrf) => {
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockImplementation((key) => {
        if (key === 'xcsrf') {
            return xcsrf;
        }

        return null;
    });
};

delete window.location;
window.location = { href: '' };

describe('Admin Page', () => {
    test('redirects unauthorized user to login page', async () => {
        await testPageLoad(false, false);
    });

    test('redirects non-admin user to home page', async () => {
        await testPageLoad(true, false);
    });

    test('loads admin content for admin user', async () => {
        await testPageLoad(true, true);
    });

    test('redirects user to error page in the case of a backend error', async () => {
        await testPageLoad(true, false, true);
    });

    const testPageLoad = async (isAuthenticated, isAdmin, isError = false) => {
        const xcsrf = 'ThisIsAnXcsrfTokenForTestingPuroses';
        const adminMessage = 'This is some kind of an admin content for testing purposes.';

        mockLocalStorage(xcsrf);

        if(isError) {
            callApi.mockReturnValue({
                status: 500,
                payload: null
            });
        } else {
            if(isAuthenticated) {
                callApi.mockReturnValue({
                    status: isAdmin ? 200 : 403,
                    payload: isAdmin ? {
                        message: adminMessage
                    } : null
                });
            } else {
                callApi.mockReturnValue({
                    status: 401,
                    payload: null
                });
            }
        }

        render(<Admin />);

        await waitFor(() => {
            expect(callApi).toHaveBeenCalledWith('/api/admin', 'GET', xcsrf);
        });

        if(isError) {
            expect(window.location.href).toBe('/error');
            return;
        }

        if(!isAuthenticated) {
            expect(window.location.href).toBe('/login');
            return;
        }

        if(isAdmin) {
            expect(screen.getByText(adminMessage)).toBeInTheDocument();
        } else {
            expect(window.location.href).toBe('/');
        }
    };
});