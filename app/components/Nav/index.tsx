'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './nav.module.css';
import Dropdown from './Dropdown';
import { useAuthContext } from '../../contexts/AuthContext';


export default function Nav() {
  const { isAuthenticated, logout } = useAuthContext();
  const [isClient, setIsClient] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const updateTimer = () => {
      // Minuit ce soir (fin de la journée actuelle)
      const now = new Date();
      const midnightTonight = new Date(now);
      midnightTonight.setHours(23, 59, 59, 999);
      
      if (now < midnightTonight) {
        const diff = midnightTonight.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining('');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const isLoggedIn = isClient && (isAuthenticated || (typeof window !== 'undefined' && localStorage.getItem('authToken')));
  const isAdminLoggedIn = isClient && (typeof window !== 'undefined' && localStorage.getItem('adminToken'));

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <Link className={styles.logo} href="/">
          <Image
            src="/images/Logo.png"
            alt="4Chaos Logo"
            width={156}
            height={50}
            priority
          />
        </Link>

        <button 
          className={styles.hamburger} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={mobileMenuOpen ? styles.hamburgerOpen : ''}></span>
          <span className={mobileMenuOpen ? styles.hamburgerOpen : ''}></span>
          <span className={mobileMenuOpen ? styles.hamburgerOpen : ''}></span>
        </button>

        {isClient && (
          <Suspense fallback={<div>Loading...</div>}>
            <div className={`${styles.navLinks} ${mobileMenuOpen ? styles.navLinksOpen : ''}`}>
            {isAdminLoggedIn && (
              <Link href="/admin/dashboard" className={styles.adminStatus}>
                <div className={styles.adminIndicator}></div>
                <span className={styles.statusText}>Admin</span>
              </Link>
            )}
            
            {isLoggedIn && (
              <div className={styles.userStatus}>
                <div className={styles.onlineIndicator}></div>
                <span className={styles.statusText}>Online</span>
              </div>
            )}
            
            <Link href="/" className={styles.navLink} prefetch={true}>
              News
            </Link>
            
            <div className={styles.eventLinkContainer}>
              {timeRemaining ? (
                <span className={styles.countdownBadge}>{timeRemaining}</span>
              ) : (
                <span className={styles.newBadge}>NEW</span>
              )}
              <Link href="/event" className={styles.navLink}>
                Event
              </Link>
            </div>

            <Dropdown title="Game">
              <Link href="/download" className={styles.dropdownLink}>
                Download
              </Link>
              <Link href="/rules" className={styles.dropdownLink}>
                Rules
              </Link>
            </Dropdown>
            
            {isLoggedIn && (
            <Dropdown title="Shop">
              <Link href="/cash-shop" className={styles.dropdownLink}>
                Cash Shop
              </Link>
              <Link href="/donate" className={styles.dropdownLink}>
                Donate
              </Link>
            </Dropdown>
            )}
            
            <Dropdown title="Account">
              {isLoggedIn ? (
                <>
                  <Link href="/account-management" className={styles.dropdownLink}>
                    Management
                  </Link>
                  <Link href="/tickets" className={styles.dropdownLink}>
                    Tickets
                  </Link>
                  <a 
                    href="#" 
                    className={styles.dropdownLink}
                    onClick={async (e) => {
                      e.preventDefault();
                      logout();
                      if (typeof window !== "undefined") {
                        window.location.href = "/";
                      }
                    }}
                  >
                    Logout
                  </a>
                </>
              ) : (
                <>
                  <Link href="/login" className={styles.dropdownLink}>
                    Login
                  </Link>
                  <Link href="/register" className={styles.dropdownLink}>
                    Register
                  </Link>
                </>
              )}
            </Dropdown>
            
            <Link href="/download" className={styles.navBtn}>
              <Image src="/images/play-now-btn.png" alt="Play Now" width={143} height={56}/>
            </Link>
            </div>
          </Suspense>
        )}
      </div>
    </nav>
  );
}
