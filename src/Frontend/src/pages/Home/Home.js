import React, { useEffect, useState } from "react";

import "./Home.css";
import Table from "../../components/Table/Table";
import getData from "../../services/getData";
import config from "../../config/config";

const Home = ({ token, username }) => {
    const [data, setData] = useState([]);
    const [showLogout, setShowLogout] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getData(token);

            if (response.ok) {
                const result = await response.json();
                setData(result);
            } else {
                console.error(config.failedToGetData);
            }
        };

        fetchData();
    }, [token]);

    const onLogout = () => {
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
                        <a href="#" onClick={onLogout}>Logout</a>
                    </div>
                )}
            </div>
            <Table data={data} />
        </div>
    );
};

export default Home;