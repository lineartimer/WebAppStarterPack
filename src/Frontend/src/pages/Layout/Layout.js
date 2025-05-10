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
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    var layoutClass = fullWidth ? "layout" : "layout border-shadow";
    var headerClass = `${fullWidth ? "" : "sticky"} ${scrolled ? "scrolled" : ""}`;

    return (
        <div className={layoutClass}>
            <header className={headerClass}>
                <Header isMobile={isMobile} />
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
