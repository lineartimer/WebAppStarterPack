import { render, screen, waitFor } from '@testing-library/react';
import { callEndPoint } from '../../services/http';

import Admin from "./Admin";

const mockNavigateFunc = jest.fn();

jest.mock('../../services/http', () => ({
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

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigateFunc,
}));

const mockLocalStorage = (xcsrf) => {
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockImplementation((key) => {
        if (key === 'xcsrf') {
            return xcsrf;
        }

        return null;
    });
    
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(jest.fn());
    jest.spyOn(Storage.prototype, 'clear').mockImplementation(jest.fn());
};

describe('Admin Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('redirects unauthorized user to login page', async () => {
        testPageLoad();
    });

    test('redirects non-admin user to home page', async () => {
        testPageLoad('user1');
    });

    test('loads admin content for admin user', async () => {
        testPageLoad('user3');
    });

    const testPageLoad = async (username = null) => {
        const xcsrf = 'ThisIsAnXcsrfTokenForTestingPuroses';
        const adminUsername = 'user3';
        const adminMessage = 'This page is for admins only.';

        mockLocalStorage(xcsrf);

        if(username) {
            callEndPoint.mockReturnValue({
                status: username === adminUsername ? 200 : 403,
                payload: username === adminUsername ? {
                    Message: adminMessage
                } : null
            });
        } else {
            callEndPoint.mockReturnValue({
                status: 401,
                payload: null
            });
        }

        render(<Admin />);

        await waitFor(() => {
            expect(callEndPoint).toHaveBeenCalledWith('/Admin', 'GET', xcsrf);
        });

        if(username) {
            if(username === adminUsername) {
                expect(screen.getByText(adminMessage)).toBeInTheDocument();
            } else {
                expect(mockNavigateFunc).toHaveBeenCalledWith('/');
            }
            
        } else {
            expect(mockNavigateFunc).toHaveBeenCalledWith('/Login');
        }
    };
});