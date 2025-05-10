import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css"
import Admin from "./pages/Admin/Admin";
import Data from "./pages/Data/Data";
import Error from "./pages/Error/Error";
import Home from "./pages/Home/Home";
import Layout from "./pages/Layout/Layout";
import Login from "./pages/Login/Login";
import { frontend } from "./config/config";

const App = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent;

        if (/Mobi|iPhone|iPad|Android|Windows Phone/i.test(userAgent)) {
            setIsMobile(true);
        }

        if (/TV|Xbox|PlayStation|Nintendo|Bot|bot|Windows NT|Macintosh/i.test(userAgent)) {
            setIsMobile(false);
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path={frontend.urls.loginPage} element={<Login isMobile={isMobile} />} />
                <Route path={frontend.urls.errorPage} element={<Error isMobile={isMobile}/>} />

                {/* Put common elements on the Layout page: full-width pages */}
                <Route path={frontend.urls.homePage} element={<Layout isMobile={isMobile} fullWidth={true} />} >
                    <Route path={frontend.urls.homePage} element={<Home />} />
                </Route>

                {/* Put common elements on the Layout page: narrower pages */}
                <Route path={frontend.urls.homePage} element={<Layout isMobile={isMobile} fullWidth={isMobile ? true : false} />} >
                    <Route path={frontend.urls.adminPage} element={<Admin isMobile={isMobile} />} />
                    <Route path={frontend.urls.dataPage} element={<Data isMobile={isMobile} />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
