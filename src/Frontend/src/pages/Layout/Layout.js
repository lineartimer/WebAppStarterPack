import React from "react";
import { Outlet } from 'react-router-dom';

import "./Layout.css"
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";

const Layout = ({ username, fullWidth }) => {
    return (
        <div className={fullWidth ? "container-fluid" : "container"}>
            <LayoutImpl username={username} fullWidth={fullWidth} />
        </div>
    );
};

const LayoutImpl = ({ username, fullWidth }) => {
    var layoutClass = fullWidth ? "layout" : "layout border-shadow";

    return (
        <div className={layoutClass}>
            <header className={fullWidth ? "" : "sticky"}>
                <Header username={username} />
            </header>
            <main>
                {/* Placeholder for the actual page */}
                <Outlet />
            </main>
            <footer>
                <Footer />
            </footer>
        </div>
    );
};

export default Layout;
