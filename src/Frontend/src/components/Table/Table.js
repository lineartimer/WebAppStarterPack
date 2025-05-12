import "./Table.css";
import { isMobile} from "../../utils/utils";

const Table = ({ data }) => {
    const colNames = data.length > 0 ? Object.keys(data[0]) : [];

    return (
        <div className={isMobile() ? "table table-mobile" : "table table-desktop"}>
            <table>
                <thead>
                    <tr>
                        {colNames.map((colName, index) => (
                            <th key={index}>{colName}</th>
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