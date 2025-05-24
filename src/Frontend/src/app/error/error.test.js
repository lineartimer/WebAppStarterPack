import { render, screen } from '@testing-library/react';

import Error from "./page";
import { frontend } from '../../lib/config';

describe('Error Page', () => {
    test('displays general error message', () => {
        render(<Error />);

        expect(screen.getByText(frontend.errorMessages.generalError.line1)).toBeInTheDocument();
        expect(screen.getByText(frontend.errorMessages.generalError.line2)).toBeInTheDocument();
        expect(screen.getByText(frontend.errorMessages.generalError.line3)).toBeInTheDocument();
    });
});