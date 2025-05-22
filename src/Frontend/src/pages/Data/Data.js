import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import './Data.css';
import Table from '../../components/Table/Table';
import { callEndPoint, httpMethods, responseStatus } from '../../services/http';
import { backend, frontend } from '../../config/config';

const Data = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            var response = await callEndPoint(backend.urls.data, httpMethods.Get, localStorage.getItem('xcsrf'));
            setLoading(false);

            if(response.status) {
                if(response.status == responseStatus.Ok) {
                    setData(response.payload);
                }
                else if(response.status == responseStatus.UnAuthorized) {
                    localStorage.setItem('loginRedirectUrl', frontend.urls.dataPage);
                    navigate(frontend.urls.loginPage);
                }
                else {
                    navigate(frontend.urls.errorPage);
                }
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner-transparent"></div>
                </div>
            )}
            <Table data={data} />
        </div>
    );
};

export default Data;