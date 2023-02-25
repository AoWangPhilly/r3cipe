import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Search from "./pages/Search";
import Circle from "./pages/Circle";
import Library from "./pages/Library";
import Navbar from "./components/Navbar";
import Settings from "./pages/Settings";
import Recipe from "./pages/Recipe";
import CircleSelected from "./pages/CircleSelected";
import Create from "./pages/Create";
import { Login } from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Search />} />
                <Route path="/circle" element={<Circle />} />
                <Route path="/circle/:id" element={<CircleSelected />} />
                <Route path="/library" element={<Library />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/recipe/:id" element={<Recipe />} />
                <Route path="/create" element={<Create />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route
                    path="*"
                    element={
                        <>
                            <h1>404: Not Found</h1> <br /> <br />{" "}
                            <Link to="/">Back to Safety</Link>
                        </>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
