"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Users, LogOut, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; id: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.indexOf("application/json") !== -1) {
          return res.json();
        }
        throw new Error("Not logged in or invalid response");
      })
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="glass-card" style={{ margin: "1rem", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: "1rem", zIndex: 50 }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "700", fontSize: "1.5rem", color: "var(--neon-accent)" }}>
        <Users size={28} />
        TeamConnect
      </Link>
      
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <Link href="/explore" style={{ fontWeight: "500", transition: "color 0.2s" }} className="nav-link">Explore</Link>
        {user && <Link href="/dashboard" style={{ fontWeight: "500", transition: "color 0.2s" }} className="nav-link">Dashboard</Link>}
        
        <ThemeToggle />
        
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginLeft: "1rem", paddingLeft: "1rem", borderLeft: "1px solid var(--card-border)" }}>
            <Link href={`/profile/${user.id}`} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} className="nav-link">
              <UserIcon size={18} />
              <span style={{ fontWeight: "500" }}>{user.name}</span>
            </Link>
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: "0.4rem 0.8rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="btn btn-primary" style={{ padding: "0.5rem 1.5rem", fontSize: "0.9rem" }}>
            Sign In
          </Link>
        )}
      </div>
      
      <style jsx>{`
        .nav-link:hover {
          color: var(--neon-accent);
        }
      `}</style>
    </nav>
  );
}
