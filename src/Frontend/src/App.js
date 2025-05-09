import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css"
import Admin from "./pages/Admin/Admin";
import Data from "./pages/Data/Data";
import Error from "./pages/Error/Error";
import Home from "./pages/Home/Home";
import Layout from "./pages/Layout/Layout";
import Login from "./pages/Login/Login";
import config from "./config/config";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path={config.frontendUrls.loginPage} element={<Login />} />
                <Route path={config.frontendUrls.errorPage} element={<Error />} />

                {/* Put common elements on the Layout page: full-width pages */}
                <Route path={config.frontendUrls.homePage} element={<Layout fullWidth={true} />} >
                    <Route path={config.frontendUrls.homePage} element={<Home />} />
                </Route>

                {/* Put common elements on the Layout page: narrower pages */}
                <Route path={config.frontendUrls.homePage} element={<Layout fullWidth={false} />} >
                    <Route path={config.frontendUrls.adminPage} element={<Admin />} />
                    <Route path={config.frontendUrls.dataPage} element={<Data />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
