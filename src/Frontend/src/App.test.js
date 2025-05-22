import { render, screen, waitFor } from '@testing-library/react';
import { callEndPoint } from './services/http';
import { frontend } from './config/config';

import App from "./App";

jest.mock('./services/http', () => ({
    callEndPoint: jest.fn(() => Promise.resolve({})),
    httpMethods: {
        Get: 'GET'
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

jest.mock('./pages/Login/Login', () => () => <div data-testid="login-page">Login Page</div>);
jest.mock('./pages/Layout/Layout', () => {
    const { Outlet: MockOutlet } = require('react-router');
    return () => (
        <div data-testid="layout-page">
            <MockOutlet />
        </div>
    );
});
jest.mock('./pages/Home/Home', () => () => <div data-testid="home-page">Home Page</div>);
jest.mock('./pages/Admin/Admin', () => () => <div data-testid="admin-page">Admin Page</div>);
jest.mock('./pages/Data/Data', () => () => <div data-testid="data-page">Data Page</div>);
jest.mock('./pages/Error/Error', () => () => <div data-testid="error-page">Error Page</div>);
jest.mock('./pages/NotFound/NotFound', () => () => <div data-testid="not-found-page">Error Page</div>);

describe('App', () => {
    test('loads app', async () => {
        const xcsrf = 'ThisIsAnXcsrfTokenForTestingPuroses';
        mockLocalStorage(null);

        callEndPoint.mockReturnValue({
            status: 200,
            payload: {
                xcsrf: xcsrf
            }
        });

        render(<App />);

        expect(callEndPoint).toHaveBeenCalledWith('/Auth/GetXcsrfToken', 'GET');
    });

    test('renders login page for /Login route', async () => {
        renderAppWithRoute(frontend.urls.loginPage);

        await screen.findByTestId('login-page');

        expect(screen.getByTestId('login-page')).toBeInTheDocument();
        expect(screen.queryByTestId('layout-pagee')).not.toBeInTheDocument();
    });

    test('renders home page (inside layout) for / route', async () => {
        renderAppWithRoute(frontend.urls.homePage);

        await screen.findByTestId('home-page');

        expect(screen.getByTestId('layout-page')).toBeInTheDocument();
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
        expect(screen.getByTestId('layout-page')).toContainElement(screen.getByTestId('home-page'));
    });

    test('renders admin page (inside layout) for /Admin route', async () => {
        renderAppWithRoute(frontend.urls.adminPage);

        await screen.findByTestId('admin-page');

        expect(screen.getByTestId('layout-page')).toBeInTheDocument();
        expect(screen.getByTestId('admin-page')).toBeInTheDocument();
        expect(screen.getByTestId('layout-page')).toContainElement(screen.getByTestId('admin-page'));
    });

    test('renders data page (inside layout) for /Data route', async () => {
        renderAppWithRoute(frontend.urls.dataPage);

        await screen.findByTestId('data-page');

        expect(screen.getByTestId('layout-page')).toBeInTheDocument();
        expect(screen.getByTestId('data-page')).toBeInTheDocument();
        expect(screen.getByTestId('layout-page')).toContainElement(screen.getByTestId('data-page'));
    });

    test('renders error page for /Error route', async () => {
        renderAppWithRoute(frontend.urls.errorPage);

        await screen.findByTestId('error-page');

        expect(screen.getByTestId('error-page')).toBeInTheDocument();
        expect(screen.queryByTestId('layout-page')).not.toBeInTheDocument();
    });

    test('renders not found page for any other route', async () => {
        renderAppWithRoute('/non-existing-resource');

        await screen.findByTestId('not-found-page');

        expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
        expect(screen.queryByTestId('layout-page')).not.toBeInTheDocument();
    });

    const renderAppWithRoute = (route) => {
        window.history.pushState({}, 'Test Page', route);

        const xcsrf = 'ThisIsAnXcsrfTokenForTestingPuroses';
        callEndPoint.mockReturnValue({
            status: 200,
            payload: {
                xcsrf: xcsrf
            }
        });

        return render(<App />);
    };
});