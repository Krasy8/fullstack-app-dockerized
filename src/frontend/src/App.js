import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./components/MainLayout";
import AuthForm from "./components/AuthForm";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainLayout />} />
                <Route path="/auth" element={<AuthForm />} />
            </Routes>
        </Router>
    )
}

export default App;
