import './App.css';
import { useState, useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate, useNavigate} from "react-router-dom";

import MainLayout from "./components/MainLayout";
import AuthForm from "./components/AuthForm";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('isAuthenticated') === 'true';
    });

    const [isJwtTokenPresent, setIsJwtTokenPresent] = useState(() => {
        return localStorage.getItem('jwtToken') != null;
    });
    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    }

    const handleLogout = () => {
        console.log("Log out clicked");
        setIsAuthenticated(false);
        localStorage.setItem('jwtToken', '');
        localStorage.removeItem('jwtToken');
        setIsJwtTokenPresent(false);
    }

    // useEffect to monitor state changes and log them
    useEffect(() => {
        localStorage.setItem('isAuthenticated', isAuthenticated.toString());
        console.log('Is authenticated:', isAuthenticated);
    }, [isAuthenticated]); // This will log the correct value whenever isAuthenticated changes

    useEffect(() => {
        console.log('Is JWT present:', isJwtTokenPresent);
    }, [isJwtTokenPresent]);

    return (
        <Router>
            <Routes>
                {/*/!* Default route *!/*/}
                <Route path="/" element={<Navigate to="/authenticating" />} />

                {/* Public route: login and registration page */}
                <Route path="/authenticating" element={<AuthForm onLoginSuccess={handleLoginSuccess}/>}/>

                {/* Protected route: only accessible after login or registration */}
                <Route path="/authorized" element={isAuthenticated ? <MainLayout handleLogout={handleLogout}/> : <Navigate to="/authenticating"/>}/>
            </Routes>
        </Router>
    )
}

export default App;
