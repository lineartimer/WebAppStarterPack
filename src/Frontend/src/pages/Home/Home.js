import React, { useEffect, useState } from "react";

import "./Home.css";
import { getData } from "../../services/backend";
import Table from "../../components/Table/Table";

const Home = ({ token, username }) => {
    const [data, setData] = useState([]);
    const [showLogout, setShowLogout] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            var response = getData(token);

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
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        window.location.reload();
    };

    return (
        <div>
            <div className="header">
                <a href="#" className="username-link" onClick={(e) => {
                    e.preventDefault();
                    setShowLogout(!showLogout);
                }}>{username}</a>
                {showLogout && (
                    <div className="logout-window">
                        <a href="#" onClick={handleLogout}>
                            Logout
                        </a>
                    </div>
                )}
            </div>
            <Table data={data} />
        </div>
    );
};

export default Home;