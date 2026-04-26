"use client";

import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-outline"
      style={{ padding: "0.5rem", borderRadius: "50%", border: "none" }}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon size={20} color="var(--text-primary)" />
      ) : (
        <Sun size={20} color="var(--text-primary)" />
      )}
    </button>
  );
}
