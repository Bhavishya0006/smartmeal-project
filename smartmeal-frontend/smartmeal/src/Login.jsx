import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import API_URL from "./api";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("RESIDENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }

    try {
      setLoading(true);

      
const response = await axios.post(
  `${API_URL}/login`,
  {
    username: username,
    password: password,
  }
);


      const user = response.data;

      // Check selected role with actual backend role
      if (user.role !== selectedRole) {
        setError(
          `This account is not a ${selectedRole.toLowerCase()} account.`
        );
        setLoading(false);
        return;
      }

      // Save logged-in user
      localStorage.setItem("smartmealUser", JSON.stringify(user));

      // Redirect according to actual role
      if (user.role === "ADMIN") {
        navigate("/");
      } else if (user.role === "RESIDENT") {
        navigate("/resident");
      } else if (user.role === "COOK") {
        navigate("/cook");
      } else {
        setError("Unknown user role.");
      }
    } catch (err) {
      if (err.response?.data) {
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : "Invalid username or password."
        );
      } else {
        setError("Unable to connect to server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        {/* Left Side */}
        <div className="login-info">

          <div className="brand">
            <div className="brand-logo">SM</div>
            <span>SmartMeal</span>
          </div>

          <div className="login-info-content">
            <h1>Welcome Back</h1>

            <p>
              Manage meals, bookings, attendance and food operations
              from one smart platform.
            </p>

            <div className="login-features">
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Easy meal management</span>
              </div>

              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Simple meal booking</span>
              </div>

              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Food waste tracking</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side */}
        <div className="login-form-section">

          <div className="login-form-container">

            <div className="login-heading">
              <h2>Sign In</h2>
              <p>Choose your role and enter your account details.</p>
            </div>

            {/* Role Buttons */}
            <div className="role-section">

              <label>Login As</label>

              <div className="role-buttons">

                <button
                  type="button"
                  className={`role-button ${
                    selectedRole === "ADMIN" ? "active" : ""
                  }`}
                  onClick={() => setSelectedRole("ADMIN")}
                >
                  <span className="role-title">Admin</span>
                  <span className="role-description">
                    Manage system
                  </span>
                </button>

                <button
                  type="button"
                  className={`role-button ${
                    selectedRole === "COOK" ? "active" : ""
                  }`}
                  onClick={() => setSelectedRole("COOK")}
                >
                  <span className="role-title">Cook</span>
                  <span className="role-description">
                    Manage meals
                  </span>
                </button>

                <button
                  type="button"
                  className={`role-button ${
                    selectedRole === "RESIDENT" ? "active" : ""
                  }`}
                  onClick={() => setSelectedRole("RESIDENT")}
                >
                  <span className="role-title">Resident</span>
                  <span className="role-description">
                    Book meals
                  </span>
                </button>

              </div>

            </div>

            <form onSubmit={handleLogin}>

              <div className="input-group">
                <label htmlFor="username">Username</label>

                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

            
<div className="input-group">
  <label htmlFor="password">Password</label>

  <div className="password-input-wrapper">
    <input
      id="password"
      type={showPassword ? "text" : "password"}
      placeholder="Enter your password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button
      type="button"
      className="password-toggle"
      onClick={() => setShowPassword((previous) => !previous)}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? "🙈" : "👁"}
    </button>
  </div>
</div>
              {error && (
                <div className="login-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? "Signing In..." : `Sign In as ${selectedRole}`}
              </button>

            </form>

            <div className="login-footer">
              SmartMeal Management System
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;