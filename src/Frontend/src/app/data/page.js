'use client'

import { useEffect, useState } from 'react';

import Table from '../../components/table/table';
import { callEndPoint, httpMethods, responseStatus } from '../../lib/http';
import { backend, frontend } from '../../lib/config';

const Data = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const response = await callEndPoint(backend.urls.data, httpMethods.Get, localStorage.getItem('xcsrf'));
            setLoading(false);

            if(response.status) {
                if(response.status == responseStatus.Ok) {
                    setData(response.payload);
                }
                else if(response.status == responseStatus.UnAuthorized) {
                    localStorage.setItem('loginRedirectUrl', frontend.urls.dataPage);
                    
                    redirect(frontend.urls.loginPage);
                }
                else {
                    redirect(frontend.urls.errorPage);
                }
            }
        };

        fetchData();
    }, []);

    return (
        <div className="main">
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