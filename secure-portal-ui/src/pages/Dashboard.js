import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { registerUser } from "../api/authApi";
import "../styles/dashboard.css";

export default function Dashboard() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    let userEmail = "Unknown User";

    // =========================
    // DECODE JWT
    // =========================
    if (token) {
        try {
            const decoded = jwtDecode(token);
            userEmail = decoded.email || decoded["email"] || "Unknown User";
        } catch (err) {
            console.log("Invalid token");
        }
    }

    // =========================
    // STATE
    // =========================
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // =========================
    // VALIDATION RULES
    // =========================
    const allowedEmailRegex =
        /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|icloud\.com)$/;

    const passwordRegex = /^(?=.*\d)[A-Za-z\d]{5,}$/;

    // =========================
    // NAVIGATION
    // =========================
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const openModal = () => {
        setShowModal(true);
        setMessage("");
        setError("");
    };

    const closeModal = () => {
        setShowModal(false);
        setEmail("");
        setPassword("");
        setMessage("");
        setError("");
    };

    // =========================
    // CREATE USER
    // =========================
    const handleCreateUser = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        // VALIDATION
        if (!allowedEmailRegex.test(email)) {
            setError("Only Gmail, Yahoo, Outlook, or iCloud emails allowed.");
            return;
        }

        if (!passwordRegex.test(password)) {
            setError("Password must be at least 5 characters and include 1 number.");
            return;
        }

        setLoading(true);

        try {
            const res = await registerUser({ email, password });

            setMessage(res.data.message || "User created successfully");

            setEmail("");
            setPassword("");

        } catch (err) {
            
            setError(err.response?.data?.message || "User already exists");
        }

        setLoading(false);
    };

    return (
        <div className="dashboard-container">

            {/* ========================= */}
            {/* SIDEBAR */}
            {/* ========================= */}
            <div className="sidebar">
                <h2>SecurePortal</h2>

                <button onClick={() => navigate("/dashboard")}>
                    Dashboard
                </button>

                <button onClick={openModal}>
                    + Create User
                </button>

                <button onClick={logout}>
                    Logout
                </button>
            </div>

            {/* ========================= */}
            {/* MAIN CONTENT */}
            {/* ========================= */}
            <div className="main-content">

                <h1>Admin Dashboard 👨‍💻</h1>

                {/* USER EMAIL CARD */}
                <div className="card">
                    <h3>Logged in User</h3>
                    <p>{userEmail}</p>
                </div>

                {/* DASHBOARD CARDS */}
                <div className="card-grid">

                    <div className="card">
                        <h3>Total Users</h3>
                        <p>Managed via system</p>
                    </div>

                    <div className="card">
                        <h3>System Status</h3>
                        <p>Online 🟢</p>
                    </div>

                    <div className="card">
                        <h3>Security</h3>
                        <p>JWT Protected 🔐</p>
                    </div>

                </div>
            </div>

            {/* ========================= */}
            {/* MODAL */}
            {/* ========================= */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>

                        <h2>Create New User</h2>

                        {/* SUCCESS MESSAGE */}
                        {message && (
                            <p style={{ color: "green", marginBottom: "10px" }}>
                                {message}
                            </p>
                        )}

                        {/* ERROR MESSAGE */}
                        {error && (
                            <p style={{ color: "red", marginBottom: "10px" }}>
                                {error}
                            </p>
                        )}

                        <form onSubmit={handleCreateUser}>
                            <input
                                className="auth-input"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <input
                                className="auth-input"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <button
                                className="auth-button"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create User"}
                            </button>
                        </form>

                        <button className="close-btn" onClick={closeModal}>
                            Close
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
}