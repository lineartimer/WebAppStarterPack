import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css"
import Data from "./pages/Data/Data";
import Home from "./pages/Home/Home";
import Layout from "./pages/Layout/Layout";
import Login from "./pages/Login/Login";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/Login" element={<Login />} />

                {/* Put common elements on the Layout page: full-width pages */}
                <Route path="/" element={<Layout fullWidth={true} />} >
                    <Route path="/" element={<Home />} />
                </Route>

                {/* Put common elements on the Layout page: narrower pages */}
                <Route path="/" element={<Layout fullWidth={false} />} >
                    <Route path="/Data" element={<Data />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
