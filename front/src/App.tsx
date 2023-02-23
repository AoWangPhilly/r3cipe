import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
} from "react-router-dom";
import Home from "./pages/";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                
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
