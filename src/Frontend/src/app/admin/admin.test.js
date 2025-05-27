import { render, screen, waitFor } from '@testing-library/react';
import { callEndPoint } from '../../lib/http';

import Admin from "./page";

delete window.location;
window.location = { href: '' };

jest.mock('../../lib/http', () => ({
    callEndPoint: jest.fn(() => Promise.resolve({})),
    httpMethods: {
        Get: 'GET'
    },
    responseStatus: {
        Ok: 200,
        UnAuthorized: 401,
        Forbidden: 403
    }
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
        const adminMessage = 'This page is for admins only.';

        mockLocalStorage(xcsrf);

        if(isError) {
            callEndPoint.mockReturnValue({
                status: 500,
                payload: null
            });
        } else {
            if(isAuthenticated) {
                callEndPoint.mockReturnValue({
                    status: isAdmin ? 200 : 403,
                    payload: isAdmin ? {
                        message: adminMessage
                    } : null
                });
            } else {
                callEndPoint.mockReturnValue({
                    status: 401,
                    payload: null
                });
            }
        }

        render(<Admin />);

        await waitFor(() => {
            expect(callEndPoint).toHaveBeenCalledWith('/Admin', 'GET', xcsrf);
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