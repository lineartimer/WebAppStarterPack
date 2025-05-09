import { useState, useEffect } from "react";
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
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    var layoutClass = fullWidth ? "layout" : "layout border-shadow";
    var headerClass = `${fullWidth ? "" : "sticky"} ${scrolled ? "scrolled" : ""}`;

    return (
        <div className={layoutClass}>
            <header className={headerClass}>
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
