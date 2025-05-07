import React, { useEffect, useState } from "react";

import "./Data.css";
import Table from "../../components/Table/Table";
import { getData } from "../../services/backend";
import config from "../../config/config";

const Data = ({ token }) => {
    const [data, setData] = useState([]);

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

    return (
        <div>
            <Table data={data} />
        </div>
    );
};

export default Data;