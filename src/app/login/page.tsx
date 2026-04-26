"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get("content-type");
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();
        setError(data.error || "Login failed");
      } else {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        setError("The server returned an invalid response. Please check if the backend is running correctly.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card" 
        style={{ padding: "3rem", width: "100%", maxWidth: "450px", display: "flex", flexDirection: "column", gap: "2rem" }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Welcome Back</h1>
          <p style={{ color: "var(--text-secondary)" }}>Sign in to connect with your team</p>
        </div>

        {error && <div style={{ color: "red", background: "rgba(255,0,0,0.1)", padding: "1rem", borderRadius: "0.5rem" }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Email</label>
            <input 
              type="email" 
              className="input-field" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem", padding: "1rem" }}>
            Sign In
          </button>
        </form>

        <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>
          Don't have an account? <Link href="/register" style={{ color: "var(--neon-accent)", fontWeight: "600" }}>Register here</Link>
        </p>
      </motion.div>
    </div>
  );
}
