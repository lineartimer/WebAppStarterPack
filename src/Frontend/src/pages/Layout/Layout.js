import { useState, useEffect } from 'react';
import { Outlet } from 'react-router';

import './Layout.css'
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';

const Layout = () => {
    return (
        <div className="container-fluid">
            <LayoutImpl />
        </div>
    );
};

const LayoutImpl = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="layout">
            <header className={`sticky ${scrolled ? 'scrolled' : ''}`}>
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
