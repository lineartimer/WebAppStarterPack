import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';

import './App.css'
import Login from './pages/Login/Login';
import Layout from './pages/Layout/Layout';
import Admin from './pages/Admin/Admin';
import Data from './pages/Data/Data';
import Home from './pages/Home/Home';
import Error from './pages/Error/Error';
import NotFound from './pages/NotFound/NotFound';
import { frontend } from './config/config';
import { callEndPoint, httpMethods } from './services/http';

const App = () => {
    useEffect(() => {
        const setXsrfToken = async () => {
            var response = await callEndPoint('/Auth/GetXcsrfToken', httpMethods.Get);
            localStorage.setItem('xcsrf', response.payload.xcsrf);
        };

        setXsrfToken();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path={frontend.urls.loginPage} element={<Login />} />
                <Route path={frontend.urls.errorPage} element={<Error />} />
                <Route path={frontend.urls.notFoundPage} element={<NotFound />} />

                {/* Put common elements on the Layout page */}
                <Route path={frontend.urls.homePage} element={<Layout />} >
                    <Route path={frontend.urls.homePage} element={<Home />} />
                    <Route path={frontend.urls.adminPage} element={<Admin />} />
                    <Route path={frontend.urls.dataPage} element={<Data />} />
                </Route>

                {/* For all other paths */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;