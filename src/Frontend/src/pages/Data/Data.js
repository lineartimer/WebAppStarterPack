import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Data.css";
import Table from "../../components/Table/Table";
import { getData, responseStatus } from "../../services/backend";

const Data = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            var response = await getData();
            setLoading(false);

            if(response.status) {
                if(response.status == responseStatus.Ok) {
                    setData(response.data);
                    setLoading(false);
                }
                else if(response.status == responseStatus.UnAuthorized) {
                    localStorage.setItem("loginRedirectUrl", "/Data");
                    navigate("/Login");
                }
                else {
                    navigate("/Error");
                }
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                </div>
            )}
            <Table data={data} />
        </div>
    );
};

export default Data;