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
                {/*/!* Default route *!/*/}
                <Route path="/" element={<Navigate to="/authenticating" />} />

                {/* Public route: login and registration page */}
                <Route path="/authenticating" element={<AuthForm onLoginSuccess={handleLoginSuccess}/>}/>

                {/* Protected route: only accessible after login or registration */}
                <Route path="/authorized" element={isAuthenticated ? <MainLayout/> : <Navigate to="/authenticating"/>}/>
            </Routes>
        </Router>
    )
}

export default App;
