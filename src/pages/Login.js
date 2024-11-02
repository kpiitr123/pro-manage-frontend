import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import "../styles/auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", formData);
      login(response.data.user, response.data.token);
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-illustration-container">
          <div className="auth-illustration-bg" />
          <img
            src="/login_logo.png"
            alt="Task Management"
            className="auth-illustration"
          />
        </div>
        <h1 className="welcome-text">Welcome aboard my friend</h1>
        <p className="welcome-subtext">just a couple of clicks and we start</p>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <h2 className="form-title">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <span className="input-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </span>
            </div>

            <div className="form-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="input-icon">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </span>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-link">
            <p>Have no account yet?</p>
            <Link to="/register">
              <button className="auth-link-button">Register</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
