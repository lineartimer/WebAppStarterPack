import { render, screen, waitFor } from '@testing-library/react';
import { callEndPoint } from '../../services/http';

import Data from "./Data";

const mockNavigateFunc = jest.fn();

jest.mock('../../services/http', () => ({
    callEndPoint: jest.fn(() => Promise.resolve({})),
    httpMethods: {
        Get: 'GET'
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

describe('Data Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('redirects unauthorized user to login page', async () => {
        await testPageLoad(false);
    });

    test('displays data for authenticated user', async () => {
        await testPageLoad(true);
    });

    test('redirects user to error page in the case of a backend error', async () => {
        await testPageLoad(true, true);
    });

    const testPageLoad = async (isAuthenticated, isError = false) => {
        const xcsrf = 'ThisIsAnXcsrfTokenForTestingPuroses';

        mockLocalStorage(xcsrf);

        if(isError) {
            callEndPoint.mockReturnValue({
                status: 500,
                payload: null
            });
        } else {
            if(isAuthenticated) {
                callEndPoint.mockReturnValue({
                    status: 200,
                    payload: [
                        {
                            "id": 1,
                            "col1": "Val-1-1",
                            "col2": "Val-1-2",
                            "col3": "Val-1-3"
                        },
                        {
                            "id": 2,
                            "col1": "Val-2-1",
                            "col2": "Val-2-2",
                            "col3": "Val-2-3"
                        },
                        {
                            "id": 3,
                            "col1": "Val-3-1",
                            "col2": "Val-3-2",
                            "col3": "Val-3-3"
                        }
                    ]
                });
            } else {
                callEndPoint.mockReturnValue({
                    status: 401,
                    payload: null
                });
            }
        }

        render(<Data />);

        await waitFor(() => {
            expect(callEndPoint).toHaveBeenCalledWith('/Data', 'GET', xcsrf);
        });

        if(isError) {
            expect(mockNavigateFunc).toHaveBeenCalledWith('/Error');
            return;
        }
        
        if(isAuthenticated) {
            expect(screen.getByRole('table')).toBeInTheDocument();
        } else {
            expect(mockNavigateFunc).toHaveBeenCalledWith('/Login');
        }
    };
});