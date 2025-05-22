import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';

import Layout from "./Layout";

jest.mock('../../components/Header/Header', () => () => <div data-testid="header">Header</div>);
jest.mock('../../components/Footer/Footer', () => () => <div data-testid="footer">Footer</div>);

const MockOutletContent = () => <div data-testid="outlet-content">Outlet Content</div>;

describe('Layout Page', () => {
    const renderLayout = () => {
        return render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<MockOutletContent />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );
    };

    test('renders Header, Footer, and Outlet content', () => {
        renderLayout();

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
        expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
    });

    test('header has "sticky" class initially', () => {
        renderLayout();

        const headerElement = screen.getByTestId('header').parentElement;
        expect(headerElement).toHaveClass('sticky');
        expect(headerElement).not.toHaveClass('scrolled');
    });

    test('header gets "scrolled" class after scrolling down', () => {
        renderLayout();

        const headerElement = screen.getByTestId('header').parentElement;

        fireEvent.scroll(window, { target: { scrollY: 100 } });
        expect(headerElement).toHaveClass('sticky', 'scrolled');
    });

    test('header loses "scrolled" class after scrolling back to top', () => {
        renderLayout();

        const headerElement = screen.getByTestId('header').parentElement;

        fireEvent.scroll(window, { target: { scrollY: 100 } });
        expect(headerElement).toHaveClass('scrolled');

        fireEvent.scroll(window, { target: { scrollY: 0 } });
        expect(headerElement).not.toHaveClass('scrolled');
        expect(headerElement).toHaveClass('sticky');
    });
});