import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
} from "react-router-dom";
import Home from "./pages/";
import Ingredients from "./pages/ingredients";
import Recipe from "./pages/recipe";
import Search from "./pages/search";

function App() {
    return (
        <Router>
            <Link to="/">Home</Link>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ingredients" element={<Ingredients />} />
                <Route path="/recipe">
                    <Route path=":id" element={<Recipe />} />
                </Route>
                <Route path="/search">
                    <Route path=":query" element={<Search />} />
                </Route>
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
