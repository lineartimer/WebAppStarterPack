'use client'

import { useEffect, useState } from 'react';

import { callApi } from '../../lib/client';
import { httpMethods, responseStatus } from '../../lib/utils';
import { frontend } from '../../lib/config';

const Admin = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const response = await callApi(frontend.urls.api.admin, httpMethods.Get, localStorage.getItem('xcsrf'));
            setLoading(false);

            if(response.status) {
                if(response.status === responseStatus.Ok) {
                    setData(response.payload.message);
                }
                else if(response.status === responseStatus.UnAuthorized) {
                    localStorage.setItem('loginRedirectUrl', frontend.urls.pages.adminPage);

                    window.location.href = frontend.urls.pages.loginPage;
                }
                else if(response.status === responseStatus.Forbidden) {
                    localStorage.setItem('loginRedirectUrl', frontend.urls.pages.homePage);

                    window.location.href = frontend.urls.pages.homePage;
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
            <div className="description description-big">{data}</div>
        </div>
    );
};

export default Admin;