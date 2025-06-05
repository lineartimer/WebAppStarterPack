import { render, screen } from '@testing-library/react';

import Navigation from './navigation';
import { isMobile } from '../../lib/utils';

jest.mock('../../lib/config', () => ({
    backend: {
        roles: {
            admin: 'Admin',
        }
    },
    frontend: {
        urls: {
            pages: {
                adminPage: '/admin',
                dataPage: '/data',
            }
        },
        noshow: {
            navigationComponent: [
                '/login',
                '/error'
            ]
        }
    },
}));

const mockAdminRole = 'Admin';
const mockAdminPageUrl = '/admin';
const mockDataPageUrl = '/data';

jest.mock('../../lib/utils', () => ({
    isMobile: jest.fn(),
}));

const mockLocalStorage = (username, role) => {
    // Spying intercepts calls to getItem and overrides its behavior
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

describe('Navigation Component', () => {
    describe('User Not Logged In', () => {
        test('renders no navigation links (desktop)', () => {
            render(<Navigation />);

            isMobile.mockReturnValue(false);

            expect(screen.queryByRole('link', { name: /admin/i })).not.toBeInTheDocument();
            expect(screen.queryByRole('link', { name: /data/i })).not.toBeInTheDocument();
        });

        test('renders no navigation links (mobile)', () => {
            render(<Navigation />);

            isMobile.mockReturnValue(true);
            
            expect(screen.queryByRole('link', { name: /admin/i })).not.toBeInTheDocument();
            expect(screen.queryByRole('link', { name: /data/i })).not.toBeInTheDocument();
        });
    });

    describe('Non-Admin User Logged In', () => {
        beforeEach(() => {
            mockLocalStorage('user1', 'User');
        });

        test('renders Data link and not Admin link (desktop)', () => {
            isMobile.mockReturnValue(false);
            render(<Navigation />);

            const dataLink = screen.getByRole('link', { name: /data/i });

            expect(dataLink).toBeInTheDocument();
            expect(dataLink).toHaveAttribute('href', mockDataPageUrl);
            expect(dataLink).not.toHaveClass('mobile-menu-item');

            expect(screen.queryByRole('link', { name: /admin/i })).not.toBeInTheDocument();
        });

        test('renders Data link and not Admin link (mobile)', () => {
            isMobile.mockReturnValue(true);

            render(<Navigation />);

            const dataLink = screen.getByRole('link', { name: /data/i });

            expect(dataLink).toBeInTheDocument();
            expect(dataLink).toHaveAttribute('href', mockDataPageUrl);
            expect(dataLink).toHaveClass('mobile-menu-item');

            expect(screen.queryByRole('link', { name: /admin/i })).not.toBeInTheDocument();
        });
    });

    describe('Admin User Logged In', () => {
        beforeEach(() => {
            mockLocalStorage('adminUser', mockAdminRole);
        });

        test('renders both Admin and Data links (desktop)', () => {
            isMobile.mockReturnValue(false);

            render(<Navigation />);

            const adminLink = screen.getByRole('link', { name: /admin/i });

            expect(adminLink).toBeInTheDocument();
            expect(adminLink).toHaveAttribute('href', mockAdminPageUrl);
            expect(adminLink).not.toHaveClass('mobile-menu-item');

            const dataLink = screen.getByRole('link', { name: /data/i });

            expect(dataLink).toBeInTheDocument();
            expect(dataLink).toHaveAttribute('href', mockDataPageUrl);
            expect(dataLink).not.toHaveClass('mobile-menu-item');
        });

        test('renders both Admin and Data links (mobile)', () => {
            isMobile.mockReturnValue(true);

            render(<Navigation />);

            const adminLink = screen.getByRole('link', { name: /admin/i });

            expect(adminLink).toBeInTheDocument();
            expect(adminLink).toHaveAttribute('href', mockAdminPageUrl);
            expect(adminLink).toHaveClass('mobile-menu-item');

            const dataLink = screen.getByRole('link', { name: /data/i });

            expect(dataLink).toBeInTheDocument();
            expect(dataLink).toHaveAttribute('href', mockDataPageUrl);
            expect(dataLink).toHaveClass('mobile-menu-item');
        });
    });
});