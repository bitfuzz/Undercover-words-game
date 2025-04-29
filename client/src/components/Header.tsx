import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useGameContext } from "@/context/GameContext";
import { useDarkMode } from "@/hooks/use-dark-mode";

export default function Header() {
  const { setIsRulesModalOpen } = useGameContext();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  return (
    <header className="bg-white dark:bg-neutral shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <a className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M17 3a2.85 2.85 0 1 1 0 5.7" />
                <path d="M10.5 3a2.85 2.85 0 1 1 0 5.7" />
                <path d="M4 3a2.85 2.85 0 1 1 0 5.7" />
                <path d="M17 16a2.85 2.85 0 1 1 0 5.7" />
                <path d="M10.5 16a2.85 2.85 0 1 1 0 5.7" />
                <path d="M4 16a2.85 2.85 0 1 1 0 5.7" />
                <path d="M4 9v4" />
                <path d="M10.5 9v4" />
                <path d="M17 9v4" />
              </svg>
              <h1 className="font-display font-bold text-xl">Undercover</h1>
            </a>
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            className="text-sm font-medium text-primary dark:text-primary-light"
            onClick={() => setIsRulesModalOpen(true)}
          >
            Rules
          </button>
          <button 
            className="text-sm font-medium bg-neutral-100 dark:bg-neutral-light px-3 py-1 rounded-full"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </header>
  );
}
