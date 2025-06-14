'use client'

import { useEffect, useState } from 'react';

import Table from '../../components/table/table';
import { callApi } from '../../lib/client';
import { httpMethods, responseStatus } from '../../lib/utils';
import { frontend } from '../../lib/config';

const Data = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const response = await callApi(frontend.urls.api.data, httpMethods.Get, localStorage.getItem('xcsrf'));
            setLoading(false);

            if(response.status) {
                if(response.status == responseStatus.Ok) {
                    setData(response.payload);
                }
                else if(response.status == responseStatus.UnAuthorized) {
                    localStorage.setItem('loginRedirectUrl', frontend.urls.pages.dataPage);
                    
                    window.location.href = frontend.urls.pages.loginPage;
                }
                else {
                    window.location.href = frontend.urls.pages.errorPage;
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