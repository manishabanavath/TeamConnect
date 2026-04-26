"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, User, Briefcase, Code } from "lucide-react";

export default function ExplorePage() {
  const [tab, setTab] = useState<"projects" | "users">("projects");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, usersRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/users")
        ]);

        const projectsData = projectsRes.ok && projectsRes.headers.get("content-type")?.includes("application/json") 
          ? await projectsRes.json() 
          : { projects: [] };
          
        const usersData = usersRes.ok && usersRes.headers.get("content-type")?.includes("application/json") 
          ? await usersRes.json() 
          : { users: [] };

        setProjects(projectsData.projects || []);
        setUsers(usersData.users || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.requirements.some((r: any) => r.skill.name.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.skills.some((s: any) => s.skill.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Explore</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>Find open projects or talented students to collaborate with.</p>
      </div>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "2rem" }}>
        <button 
          onClick={() => setTab("projects")} 
          className={`btn ${tab === "projects" ? "btn-primary" : "btn-outline"}`}
          style={{ width: "150px" }}
        >
          <Briefcase size={18} style={{ marginRight: "0.5rem" }} /> Projects
        </button>
        <button 
          onClick={() => setTab("users")} 
          className={`btn ${tab === "users" ? "btn-primary" : "btn-outline"}`}
          style={{ width: "150px" }}
        >
          <User size={18} style={{ marginRight: "0.5rem" }} /> Students
        </button>
      </div>

      <div style={{ position: "relative", maxWidth: "600px", margin: "0 auto", width: "100%" }}>
        <Search size={20} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
        <input 
          type="text" 
          placeholder={`Search ${tab === "projects" ? "projects or required skills" : "students or skills"}...`}
          className="input-field"
          style={{ paddingLeft: "3rem" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>Loading...</div>
      ) : (
        <motion.div 
          layout
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "2rem", marginTop: "2rem" }}
        >
          {tab === "projects" ? (
            filteredProjects.map((project) => (
              <motion.div key={project.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h3 style={{ fontSize: "1.25rem", margin: 0 }}>{project.title}</h3>
                  <span style={{ fontSize: "0.8rem", padding: "0.2rem 0.5rem", borderRadius: "1rem", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", fontWeight: "bold" }}>{project.status}</span>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", flexGrow: 1 }}>{project.description}</p>
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Code size={14} /> Required Skills:
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {project.requirements.map((req: any) => (
                      <span key={req.id} style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", borderRadius: "1rem", background: "rgba(59, 130, 246, 0.1)", color: "var(--neon-accent)" }}>
                        {req.skill.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ paddingTop: "1rem", borderTop: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Posted by {project.creator.name}</span>
                  <button className="btn btn-outline" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>Message</button>
                </div>
              </motion.div>
            ))
          ) : (
            filteredUsers.map((user) => (
              <motion.div key={user.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "linear-gradient(135deg, var(--primary-accent), var(--neon-accent))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.5rem", fontWeight: "bold" }}>
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", margin: 0 }}>{user.name}</h3>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{user.role}</span>
                  </div>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", flexGrow: 1 }}>{user.bio || "No bio provided yet."}</p>
                <div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {user.skills.map((userSkill: any) => (
                      <span key={userSkill.id} style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", borderRadius: "1rem", background: "rgba(99, 102, 241, 0.1)", color: "var(--primary-accent)" }}>
                        {userSkill.skill.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ paddingTop: "1rem", borderTop: "1px solid var(--card-border)", display: "flex", justifyContent: "flex-end" }}>
                  <button className="btn btn-primary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>Message</button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}
