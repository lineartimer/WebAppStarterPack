import { render, screen } from '@testing-library/react';

import Home from "./page";
import { frontend } from '../lib/config';

describe('Home Page', () => {
    test('displays content', () => {
        render(<Home />);

        expect(screen.getByText(frontend.content.homePage.line1)).toBeInTheDocument();
        expect(screen.getByText(frontend.content.homePage.line2)).toBeInTheDocument();
        expect(screen.getByText(frontend.content.homePage.line3)).toBeInTheDocument();
        expect(screen.getByText(frontend.content.homePage.line4)).toBeInTheDocument();
        expect(screen.getByText(frontend.content.homePage.line5)).toBeInTheDocument();
    });
});