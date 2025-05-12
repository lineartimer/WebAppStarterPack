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
    return (
        <Router>
            <Routes>
                <Route path={frontend.urls.loginPage} element={<Login />} />
                <Route path={frontend.urls.errorPage} element={<Error />} />

                {/* Put common elements on the Layout page: full-width pages */}
                <Route path={frontend.urls.homePage} element={<Layout />} >
                    <Route path={frontend.urls.homePage} element={<Home />} />
                </Route>

                {/* Put common elements on the Layout page: narrower pages */}
                <Route path={frontend.urls.homePage} element={<Layout />} >
                    <Route path={frontend.urls.adminPage} element={<Admin />} />
                    <Route path={frontend.urls.dataPage} element={<Data />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
