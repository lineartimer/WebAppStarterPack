import { render, screen, within } from '@testing-library/react';
import Table from './Table';

describe('Table Component', () => {
    test('renders an empty table structure when data is an empty array', () => {
        render(<Table data={[]} />);

        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();

        const thead = table.querySelector('thead');
        expect(thead).toBeInTheDocument();
        if (thead) {
            expect(within(thead).queryAllByRole('columnheader').length).toBe(0);
        }

        const tbody = table.querySelector('tbody');
        expect(tbody).toBeInTheDocument();
        if (tbody) {
            expect(within(tbody).queryAllByRole('row').length).toBe(0);
        }
    });

    test('renders headers and data correctly for typical data', () => {
        const data = [
            { id: 1, name: 'Alice', age: 24 },
            { id: 2, name: 'Bob', age: 30 },
        ];
        render(<Table data={data} />);

        // Check headers
        expect(screen.getByText('Id')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Age')).toBeInTheDocument();

        // Check number of data rows
        const table = screen.getByRole('table');
        const tbody = table.querySelector('tbody');
        expect(tbody).toBeInTheDocument();

        let rows = [];
        if (tbody) {
            rows = within(tbody).getAllByRole('row');
            expect(rows.length).toBe(data.length);
        }

        // Check cell content for the first data row
        if (rows.length > 0) {
            const firstRow = within(rows[0]).getAllByRole('cell');

            expect(firstRow[0]).toHaveTextContent('1');
            expect(firstRow[1]).toHaveTextContent('Alice');
            expect(firstRow[2]).toHaveTextContent('24');
        }

        // Check cell content for the second data row
        if (rows.length > 1) {
            const secondRow = within(rows[1]).getAllByRole('cell');

            expect(secondRow[0]).toHaveTextContent('2');
            expect(secondRow[1]).toHaveTextContent('Bob');
            expect(secondRow[2]).toHaveTextContent('30');
        }
    });

    test('renders correctly when data cells contain null or undefined values', () => {
        const data = [
            { id: 1, name: 'Alice', description: null },
            { id: 2, name: undefined, description: 'Item 2' },
        ];
        render(<Table data={data} />);

        // Check headers
        expect(screen.getByText('Id')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();

        const table = screen.getByRole('table');
        const tbody = table.querySelector('tbody');
        expect(tbody).toBeInTheDocument();

        if (tbody) {
            const rows = within(tbody).getAllByRole('row');
            expect(rows.length).toBe(2);

            // Null/undefined: empty strings
            const firstRowCells = within(rows[0]).getAllByRole('cell');

            expect(firstRowCells[0]).toHaveTextContent('1');
            expect(firstRowCells[1]).toHaveTextContent('Alice');
            expect(firstRowCells[2]).toHaveTextContent('');

            const secondRowCells = within(rows[1]).getAllByRole('cell');

            expect(secondRowCells[0]).toHaveTextContent('2');
            expect(secondRowCells[1]).toHaveTextContent('');
            expect(secondRowCells[2]).toHaveTextContent('Item 2');
        }
    });
});