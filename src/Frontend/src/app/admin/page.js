'use client'

import { useEffect, useState } from 'react';

import { callEndPoint, responseStatus, httpMethods } from '../../lib/http';
import { backend, frontend } from '../../lib/config';

const Admin = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const response = await callEndPoint(backend.urls.admin, httpMethods.Get, localStorage.getItem('xcsrf'));
            setLoading(false);

            if(response.status) {
                if(response.status === responseStatus.Ok) {
                    setData(response.payload.message);
                }
                else if(response.status === responseStatus.UnAuthorized) {
                    localStorage.setItem('loginRedirectUrl', frontend.urls.adminPage);

                    redirect(frontend.urls.loginPage);
                }
                else if(response.status === responseStatus.Forbidden) {
                    localStorage.setItem('loginRedirectUrl', frontend.urls.homePage);

                    redirect(frontend.urls.homePage);
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
            <div className="description description-big">{data}</div>
        </div>
    );
};

export default Admin;