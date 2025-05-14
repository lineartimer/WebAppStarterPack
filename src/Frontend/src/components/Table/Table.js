import "./Table.css";
import { capitalize } from "../../utils/utils"

const Table = ({ data }) => {
    const colNames = data.length > 0 ? Object.keys(data[0]) : [];
    
    return (
        <div className="table">
            <table>
                <thead>
                    <tr>
                        {colNames.map((colName, index) => (
                            <th key={index}>{capitalize(colName)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            {colNames.map((colName, colIndex) => (
                                <td key={colIndex}>{row[colName]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;