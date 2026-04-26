"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Folder, MessageSquare } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => {
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.indexOf("application/json") !== -1) {
          return res.json();
        }
        throw new Error("Not auth or invalid response");
      })
      .then(data => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = skills.split(",").map(s => s.trim()).filter(s => s !== "");
    
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, skills: skillsArray })
      });
      
      if (res.ok) {
        setShowModal(false);
        setTitle("");
        setDescription("");
        setSkills("");
        // Optimistic reload or refetch logic would go here
        alert("Project created successfully!");
      }
    } catch (error) {
      console.error("Failed to create project");
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "4rem" }}>Loading...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem" }}>Welcome, {user.name}</h1>
          <p style={{ color: "var(--text-secondary)" }}>Manage your projects and connect with team members.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} style={{ marginRight: "0.5rem" }} /> New Project
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        <div className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "var(--primary-accent)" }}>
            <Folder size={24} />
            <h2 style={{ fontSize: "1.5rem", margin: 0 }}>My Projects</h2>
          </div>
          <p style={{ color: "var(--text-secondary)" }}>You haven't created any projects yet. Start one to find team members!</p>
          {/* List of user's projects would go here */}
        </div>

        <div className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "var(--neon-accent)" }}>
            <MessageSquare size={24} />
            <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Messages</h2>
          </div>
          <p style={{ color: "var(--text-secondary)" }}>Your inbox is empty.</p>
          {/* Messaging UI would be embedded here */}
        </div>
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100 }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ padding: "2rem", width: "100%", maxWidth: "500px" }}>
            <h2 style={{ marginBottom: "1.5rem" }}>Create New Project</h2>
            <form onSubmit={handleCreateProject} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>Project Title</label>
                <input type="text" className="input-field" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>Description</label>
                <textarea className="input-field" rows={4} value={description} onChange={e => setDescription(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>Required Skills (comma separated)</label>
                <input type="text" className="input-field" placeholder="e.g. React, Python, UI/UX" value={skills} onChange={e => setSkills(e.target.value)} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Project</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
