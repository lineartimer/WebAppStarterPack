import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Data.css";
import Table from "../../components/Table/Table";
import { getData, responseStatus } from "../../services/backend";

const Data = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            var response = await getData();

            if(response.status) {
                if(response.status == responseStatus.Ok) {
                    setData(response.data);
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
            <Table data={data} />
        </div>
    );
};

export default Data;