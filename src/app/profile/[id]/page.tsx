"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Edit2, Save, X, Code, Briefcase, User as UserIcon } from "lucide-react";

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current logged-in user
    fetch("/api/auth/me")
      .then(res => res.ok ? res.json() : { user: null })
      .then(data => setCurrentUser(data.user));

    // Get profile data
    fetch(`/api/users/${id}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data.user);
        setBio(data.user.bio || "");
        setSkills(data.user.skills.map((s: any) => s.skill.name).join(", "));
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    const skillsArray = skills.split(",").map(s => s.trim()).filter(s => s !== "");
    
    const res = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio, skills: skillsArray, role: profile.role })
    });

    if (res.ok) {
      const data = await res.json();
      setProfile(data.user);
      setIsEditing(false);
    } else {
      alert("Failed to update profile");
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "4rem" }}>Loading profile...</div>;
  if (!profile) return <div style={{ textAlign: "center", padding: "4rem" }}>User not found</div>;

  const isOwner = currentUser?.id === profile.id;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: "3rem", position: "relative" }}>
        
        {isOwner && (
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`btn ${isEditing ? 'btn-primary' : 'btn-outline'}`}
            style={{ position: "absolute", top: "2rem", right: "2rem", padding: "0.5rem 1rem", display: "flex", gap: "0.5rem", alignItems: "center" }}
          >
            {isEditing ? <><Save size={16} /> Save</> : <><Edit2 size={16} /> Edit Profile</>}
          </button>
        )}

        {isOwner && isEditing && (
          <button 
            onClick={() => { setIsEditing(false); setBio(profile.bio || ""); setSkills(profile.skills.map((s: any) => s.skill.name).join(", ")); }}
            className="btn btn-outline"
            style={{ position: "absolute", top: "2rem", right: "8rem", padding: "0.5rem 1rem", display: "flex", gap: "0.5rem", alignItems: "center", border: "none" }}
          >
            <X size={16} /> Cancel
          </button>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "2rem" }}>
          <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "linear-gradient(135deg, var(--primary-accent), var(--neon-accent))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "3rem", fontWeight: "bold" }}>
            {profile.name.charAt(0)}
          </div>
          <div>
            <h1 style={{ fontSize: "2.5rem", margin: 0 }}>{profile.name}</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Briefcase size={16} /> {profile.role}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <UserIcon size={18} /> About
          </h3>
          {isEditing ? (
            <textarea 
              className="input-field" 
              rows={4} 
              value={bio} 
              onChange={e => setBio(e.target.value)} 
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>{profile.bio || "No bio provided."}</p>
          )}
        </div>

        <div>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Code size={18} /> Skills
          </h3>
          {isEditing ? (
            <input 
              type="text" 
              className="input-field" 
              value={skills} 
              onChange={e => setSkills(e.target.value)} 
              placeholder="React, Next.js, Figma, etc. (comma separated)"
            />
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {profile.skills.length > 0 ? profile.skills.map((s: any) => (
                <span key={s.id} style={{ padding: "0.3rem 0.8rem", borderRadius: "2rem", background: "rgba(99, 102, 241, 0.1)", color: "var(--primary-accent)", fontWeight: "500" }}>
                  {s.skill.name}
                </span>
              )) : <span style={{ color: "var(--text-secondary)" }}>No skills added yet.</span>}
            </div>
          )}
        </div>

      </motion.div>

      {/* User's Projects Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>Projects by {profile.name}</h2>
        {profile.projects.length === 0 ? (
          <p style={{ color: "var(--text-secondary)" }}>No projects posted yet.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
            {profile.projects.map((project: any) => (
              <div key={project.id} className="glass-card" style={{ padding: "1.5rem" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>{project.title}</h3>
                <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>{project.description}</p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {project.requirements.map((req: any) => (
                    <span key={req.id} style={{ fontSize: "0.8rem", padding: "0.2rem 0.6rem", borderRadius: "1rem", background: "rgba(59, 130, 246, 0.1)", color: "var(--neon-accent)" }}>
                      {req.skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
