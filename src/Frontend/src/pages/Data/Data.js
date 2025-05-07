import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Data.css";
import Table from "../../components/Table/Table";
import { getData } from "../../services/backend";

const Data = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const response = await getData();

            if (response.ok) {
                const result = await response.json();
                setData(result);
            } else {
                navigate("/Login");
            }
        };

        fetchData();
    });

    return (
        <div>
            <Table data={data} />
        </div>
    );
};

export default Data;