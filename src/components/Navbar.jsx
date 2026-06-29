import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Button } from "./ui/button";
import { useTheme } from "../lib/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 w-full h-20 bg-header-bg backdrop-blur-md border-b border-border-color z-50">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex items-center justify-between h-full">
        
        <Link to="/" className="flex items-center gap-2 no-underline text-white">
          <Icon icon="tabler:package" width="22" height="22" className="text-gold" />
          <span className="font-brand text-xl font-black tracking-[0.05em] uppercase">
            XYLO<span className="text-gold">HOST</span>
          </span>
        </Link>

        <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === "dark" ? (
            <Icon icon="lucide:sun" width="16" height="16" />
          ) : (
            <Icon icon="lucide:moon" width="16" height="16" />
          )}
        </Button>
      </div>
    </nav>
  );
}
