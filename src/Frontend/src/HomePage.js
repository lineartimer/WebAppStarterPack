import React, { useEffect, useState } from "react";
import "./HomePage.css";

const DemoTable = ({ data }) => {
    const colNames = data.length > 0 ? Object.keys(data[0]) : [];

    return (
        <div className="table-container">
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

const HomePage = ({ token, username }) => {
    const [data, setData] = useState([]);
    const [showLogout, setShowLogout] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("https://ca-backend.gentletree-c367ba6f.westeurope.azurecontainerapps.io/Data", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const result = await response.json();
                setData(result);
            } else {
                console.error("Failed to fetch data");
            }
        };

        fetchData();
    }, [token]);

    const handleLogout = () => {
        window.location.reload(); // Simple logout logic
    };

    return (
        <div>
            <div className="header">
                <a
                    href="#"
                    className="username-link"
                    onClick={(e) => {
                        e.preventDefault();
                        setShowLogout(!showLogout);
                    }}
                >
                    {username}
                </a>
                {showLogout && (
                    <div className="logout-window">
                        <a href="#" onClick={handleLogout}>
                            Logout
                        </a>
                    </div>
                )}
            </div>
            <DemoTable data={data} />
        </div>
    );
};

export default HomePage;