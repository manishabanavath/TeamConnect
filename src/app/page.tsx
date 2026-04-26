"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code, Users, Zap } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6rem", alignItems: "center" }}>
      {/* Hero Section */}
      <motion.section 
        className="hero"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ 
          textAlign: "center", 
          marginTop: "4rem",
          maxWidth: "800px",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          alignItems: "center"
        }}
      >
        <motion.div variants={itemVariants} style={{ display: "inline-block", padding: "0.5rem 1rem", borderRadius: "2rem", background: "rgba(59, 130, 246, 0.1)", color: "var(--neon-accent)", fontWeight: "600", fontSize: "0.875rem", marginBottom: "1rem" }}>
          🚀 The #1 Platform for Student Teams
        </motion.div>
        
        <motion.h1 variants={itemVariants} style={{ fontSize: "4rem", lineHeight: "1.1", background: "linear-gradient(to right, var(--primary-accent), var(--neon-accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Build Your Dream Team. <br /> Build The Future.
        </motion.h1>
        
        <motion.p variants={itemVariants} style={{ fontSize: "1.25rem", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
          Connect with talented students, find the perfect hackathon squad, and turn your brilliant ideas into reality with TeamConnect.
        </motion.p>
        
        <motion.div variants={itemVariants} style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Link href="/explore" className="btn btn-primary" style={{ padding: "1rem 2rem", fontSize: "1.1rem" }}>
            Find a Team <ArrowRight size={20} style={{ marginLeft: "0.5rem" }} />
          </Link>
          <Link href="/login" className="btn btn-outline" style={{ padding: "1rem 2rem", fontSize: "1.1rem" }}>
            Create Profile
          </Link>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", width: "100%" }}
      >
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ padding: "1rem", borderRadius: "1rem", background: "rgba(99, 102, 241, 0.1)", width: "fit-content", color: "var(--primary-accent)" }}>
            <Users size={32} />
          </div>
          <h3 style={{ fontSize: "1.5rem" }}>Skill-based Matching</h3>
          <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
            Filter students by specific programming languages, design tools, or project management skills to find the exact missing puzzle piece for your team.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ padding: "1rem", borderRadius: "1rem", background: "rgba(59, 130, 246, 0.1)", width: "fit-content", color: "var(--neon-accent)" }}>
            <Zap size={32} />
          </div>
          <h3 style={{ fontSize: "1.5rem" }}>Real-time Collaboration</h3>
          <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
            Message potential team members instantly. Discuss project ideas and align your goals before committing to a partnership.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ padding: "1rem", borderRadius: "1rem", background: "rgba(16, 185, 129, 0.1)", width: "fit-content", color: "#10b981" }}>
            <Code size={32} />
          </div>
          <h3 style={{ fontSize: "1.5rem" }}>Showcase Projects</h3>
          <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
            Create detailed project postings outlining your vision, current tech stack, and the exact roles you are looking to fill.
          </p>
        </motion.div>
      </motion.section>
    </div>
  );
}
