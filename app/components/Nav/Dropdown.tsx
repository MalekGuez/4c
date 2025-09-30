'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './nav.module.css';

interface DropdownProps {
  title: string;
  children: React.ReactNode;
}

export default function Dropdown({ title, children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsClosing(false);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsClosing(true);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className={styles.dropdown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a href="#" className={styles.navLink}>
        {title}
        <svg 
          className={`${styles.arrow} ${isOpen ? styles.arrowUp : styles.arrowDown}`}
          width="12" 
          height="8" 
          viewBox="0 0 12 8" 
          fill="none"
        >
          <path 
            d="M1 1.5L6 6.5L11 1.5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </a>
      
      {isOpen && (
        <div 
          className={`${styles.dropdownContent} ${isClosing ? styles.fadeOut : ''}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

