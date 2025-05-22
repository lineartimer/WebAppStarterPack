import { render, screen } from '@testing-library/react';

import Home from "./Home";
import { frontend } from '../../config/config';

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