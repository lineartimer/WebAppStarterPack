import { render, screen } from '@testing-library/react';

import NotFound from "./not-found";
import { frontend } from '../lib/config';

describe('Not Found Page', () => {
    test('displays not-found message', () => {
        render(<NotFound />);

        expect(screen.getByText(frontend.content.notFoundPage.notFound)).toBeInTheDocument();
    });
});