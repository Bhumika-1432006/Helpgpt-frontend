import { useState, useContext, useEffect } from "react";
import { MyContext } from "./MyContent";
import "./Signup.css";

// ADDED: Destructured onAuthSuccess from props
function Signup({ onAuthSuccess }) {
  const { theme } = useContext(MyContext);
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

    try {
      const response = await fetch("https://helpgpt-backend.onrender.com/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", data.userId);
        alert(`Welcome, ${data.username}! Account created successfully!`);
        
        // --- UPDATED: Tell App.js to hide the overlay ---
        if(onAuthSuccess) onAuthSuccess(); 
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      console.log("Signup Error:", err);
      alert("Something went wrong with the server.");
    }
  };

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className={`signup-container ${theme}`}>
      <div className="signup-box">
        <h2>Welcome to HelpGPT</h2>
        <p>Create your account to continue</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
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
          <button type="submit">Sign Up</button>
        </form>

        <p className="login-note">
          Already have an account? <span className="link">Log in</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;