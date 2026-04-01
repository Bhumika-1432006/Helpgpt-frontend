import { useState, useContext, useEffect } from "react";
import { MyContext } from "./MyContent";
import "./Signup.css";

function Signup({ onAuthSuccess }) {
  const { theme } = useContext(MyContext);
  
  // --- NEW: Toggle between Signup and Login ---
  const [isLogin, setIsLogin] = useState(false); 

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Determine which API to call based on the mode
    const endpoint = isLogin ? "login" : "signup";

    try {
      const response = await fetch(`https://helpgpt-backend.onrender.com/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", data.userId);
        
        // Custom message based on mode
        const message = isLogin ? `Welcome back!` : `Welcome, ${data.username}! Account created!`;
        alert(message);
        
        if(onAuthSuccess) onAuthSuccess(); 
      } else {
        alert(data.error || `${isLogin ? "Login" : "Signup"} failed`);
      }
    } catch (err) {
      console.log("Auth Error:", err);
      alert("Something went wrong with the server.");
    }
  };

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className={`signup-container ${theme}`}>
      <div className="signup-box">
        {/* Dynamic Heading */}
        <h2>{isLogin ? "Welcome Back" : "Welcome to HelpGPT"}</h2>
        <p>{isLogin ? "Log in to your account" : "Create your account to continue"}</p>

        <form onSubmit={handleSubmit}>
          {/* Hide Username field if in Login mode */}
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isLogin ? "Log In" : "Sign Up"}</button>
        </form>

        {/* Toggle Switch */}
        <p className="login-note">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span className="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign up" : "Log in"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;