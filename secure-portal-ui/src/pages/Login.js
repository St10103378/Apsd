import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Login({ setToken }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await loginUser({ email, password });

            localStorage.setItem("token", res.data.token);

            setToken(res.data.token);

            setMessage("Login successful ✔");

         
            setTimeout(() => {
                navigate("/dashboard", { replace: true });
            }, 800);

        } catch (err) {
            setError("Invalid email or password ❌");
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <div className="auth-title">Welcome Back</div>

                
                {message && (
                    <p style={{ color: "green", textAlign: "center" }}>
                        {message}
                    </p>
                )}

          
                {error && (
                    <p style={{ color: "red", textAlign: "center" }}>
                        {error}
                    </p>
                )}

                <form onSubmit={handleLogin}>
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

                    <button className="auth-button" type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

              

            </div>
        </div>
    );
}