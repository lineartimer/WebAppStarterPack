import { render, screen } from '@testing-library/react';

import Home from "./page";

describe('Home Page', () => {
    test('displays content', () => {
        render(<Home />);

        expect(screen.getByText(/.Net/i)).toBeInTheDocument();
        expect(screen.getByText(/React/i)).toBeInTheDocument();
        expect(screen.getByText(/Next.js/i)).toBeInTheDocument();
        expect(screen.getByText(/GitHub/i)).toBeInTheDocument();
        expect(screen.getByText(/Azure/i)).toBeInTheDocument();
    });
});