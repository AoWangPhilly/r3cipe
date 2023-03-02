import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
} from "react-router-dom";
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
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import CircleSignUp from "./pages/CircleSignUp";

function App() {
    const { isAuth } = useContext(AuthContext);

    const GoHome = () => {
        return <Navigate to="/" />;
    };

    type GoLoginProps = {
        redirect: string;
    };
    const GoLogin = (props: GoLoginProps) => {
        let route = "/login";
        if (props.redirect) {
            route += "?redirect=" + props.redirect;
        }
        return <Navigate to={route} />;
    };

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Search />} />
                {isAuth ? (
                    <>
                        <Route path="/circle" element={<Circle />} />
                        <Route
                            path="/circle/:id"
                            element={<CircleSelected />}
                        />
                        <Route
                            path="/circle-create"
                            element={<CircleSignUp />}
                        />
                        <Route path="/library" element={<Library />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/recipe/:id" element={<Recipe />} />
                        <Route path="/create" element={<Create />} />
                        <Route path="/login" element={<GoHome />} />
                        <Route path="/signup" element={<GoHome />} />
                    </>
                ) : (
                    <>
                        <Route
                            path="/circle"
                            element={<GoLogin redirect="circle" />}
                        />
                        <Route
                            path="/circle/:id"
                            //might have to change this if we want to pass the id and join
                            element={<GoLogin redirect="circle" />}
                        />
                        <Route
                            path="/circle-create"
                            element={<GoLogin redirect="circle-create" />}
                        />
                        <Route
                            path="/library"
                            element={<GoLogin redirect="library" />}
                        />
                        <Route
                            path="/settings"
                            element={<GoLogin redirect="settings" />}
                        />
                        <Route
                            path="/recipe/:id"
                            element={<GoLogin redirect="recipe" />}
                        />
                        <Route
                            path="/create"
                            element={<GoLogin redirect="create" />}
                        />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                    </>
                )}

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
