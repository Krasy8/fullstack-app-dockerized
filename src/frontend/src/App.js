import './App.css';
import { useState, useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";

import MainLayout from "./components/MainLayout";
import AuthForm from "./components/AuthForm";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    }

    // useEffect to monitor state changes and log them
    useEffect(() => {
        console.log('Is authenticated:', isAuthenticated);
    }, [isAuthenticated]); // This will log the correct value whenever isAuthenticated changes

    return (
        <Router>
            <Routes>
                {/* Public route: login and registration page */}
                <Route path="/auth" element={<AuthForm onLoginSuccess={handleLoginSuccess}/>}/>

                {/* Protected route: only accessible after login or registration */}
                <Route path="/" element={isAuthenticated ? <MainLayout/> : <Navigate to="/auth"/>}/>
                {/*<Route path="/auth/students" element={<MainLayout/>}/>*/}

                {/*/!* Default route *!/*/}
                {/*<Route path="/" element={<Navigate to={isAuthenticated ? "/auth/students" : "/auth"}/>}/>*/}
                <Route path="/" element={isAuthenticated ? <MainLayout/> : <Navigate to="/auth"/>}/>
                {/*<Route path="/" element={<Navigate to={"/auth"}/>}/>*/}
            </Routes>
        </Router>
    )
}

export default App;
