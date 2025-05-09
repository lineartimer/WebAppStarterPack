import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Admin.css";
import { callEndPoint, responseStatus, httpMethods } from "../../services/http";
import { backend, frontend } from "../../config/config";

const Admin = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            var response = await callEndPoint(backend.urls.admin, httpMethods.Get);
            setLoading(false);

            if(response.status) {
                if(response.status == responseStatus.Ok) {
                    setData(response.payload.message);
                }
                else if(response.status == responseStatus.UnAuthorized) {
                    localStorage.setItem("loginRedirectUrl", frontend.urls.adminPage);
                    navigate(frontend.urls.loginPage);
                }
                else if(response.status == responseStatus.Forbidden) {
                    localStorage.setItem("loginRedirectUrl", frontend.urls.homePage);
                    navigate(frontend.urls.homePage);
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
                    <div className="loading-spinner-transparent"></div>
                </div>
            )}
            <div className="main">
                <div className="row">
                    <div className="col-12">
                        <div className="description">{data}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;