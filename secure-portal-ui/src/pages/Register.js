import { useState } from "react";
import { registerUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Email whitelist (allowed domains)
    const allowedEmailRegex =
        /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|icloud\.com)$/;

    // Password rule: min 5 chars + at least 1 number
    const passwordRegex = /^(?=.*\d)[A-Za-z\d]{5,}$/;

    const handleRegister = async (e) => {
        e.preventDefault();

        

        if (!allowedEmailRegex.test(email)) {
            alert("Only Gmail, Yahoo, Outlook, or iCloud emails allowed.");
            return;
        }

        if (!passwordRegex.test(password)) {
            alert("Password must be at least 5 characters and include at least 1 number.");
            return;
        }

        try {
            const res = await registerUser({ email, password });

            alert(res.data.message || "Registration successful");

            navigate("/login");

        } catch (err) {
        

            if (err.response && err.response.data?.message) {
                alert(err.response.data.message); 
            } else {
                alert("Registration failed. Please try again.");
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-title">Create Account</div>

                <form onSubmit={handleRegister}>
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

                    <button className="auth-button" type="submit">
                        Register
                    </button>
                </form>

                <div className="auth-link">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
}