import React from "react";
import { Outlet } from 'react-router-dom';

import "./Layout.css"
import Footer from "../../components/Footer/Footer";
import Logo from "../../components/Logo/Logo";
import Navigation from "../../components/Navigation/Navigation";
import User from "../../components/User/User";

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
                <div className="row">
                    <div className="col-4">
                        <Logo />
                    </div>
                    <div className="col-6">
                        <Navigation username={username} />
                    </div>
                    <div className="col-2 user-wrapper">
                        <User username={username} />
                    </div>
                </div>
            </header>
            <main>
                {/* Placeholder for the actual page */}
                <Outlet />
            </main>
            <footer>
                <div className="row">
                    <div className="col-12">
                        <Footer />
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
