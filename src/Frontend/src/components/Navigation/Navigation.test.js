import { render, screen } from '@testing-library/react';

import Navigation from './Navigation';

// Mock config.js
jest.mock('../../config/config', () => ({
    backend: {
        roles: {
            admin: 'Admin',
        },
    },
    frontend: {
        urls: {
            adminPage: '/Admin',
            dataPage: '/Data',
        },
    },
}));

const mockAdminRole = 'Admin';
const mockAdminPageUrl = '/Admin';
const mockDataPageUrl = '/Data';

// Mock the isMobile utility
jest.mock('../../utils/utils', () => ({
    isMobile: jest.fn(),
}));

import { isMobile } from '../../utils/utils';

// Mock localStorage.getItem
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
        test('renders no navigation links', () => {
            isMobile.mockReturnValue(false);
            render(<Navigation />);

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

        test('renders both Admin and Data links with mobile class (mobile)', () => {
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