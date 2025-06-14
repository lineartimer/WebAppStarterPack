import { render, screen } from '@testing-library/react';

import NotFound from "./not-found";

describe('Not Found Page', () => {
    test('displays not-found message', () => {
        render(<NotFound />);
        
        expect(screen.getByText(/Nothing found/i)).toBeInTheDocument();
    });
});