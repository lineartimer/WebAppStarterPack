import React, { useState } from "react";
import { Outlet } from 'react-router-dom';

import "./Layout.css"
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";

const Layout = ({ fullWidth }) => {
    return (
        <div className={fullWidth ? "container-fluid" : "container"}>
            <LayoutImpl fullWidth={fullWidth} />
        </div>
    );
};

const LayoutImpl = ({ fullWidth }) => {
    var layoutClass = fullWidth ? "layout" : "layout border-shadow";

    return (
        <div className={layoutClass}>
            <header className={fullWidth ? "" : "sticky"}>
                <Header />
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
