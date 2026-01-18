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
  const [isEventActive, setIsEventActive] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const updateTimer = () => {
      const weekend1Start = new Date('2025-12-06T00:00:00+01:00');
      const weekend1End = new Date('2025-12-07T23:59:59+01:00');
      const weekend2Start = new Date('2025-12-13T00:00:00+01:00');
      const weekend2End = new Date('2025-12-14T23:59:59+01:00');
      const now = new Date();
      
      // Si l'événement est en cours (pendant un des weekends)
      if ((now >= weekend1Start && now <= weekend1End) || (now >= weekend2Start && now <= weekend2End)) {
        setIsEventActive(true);
        setTimeRemaining('');
      } else {
        setIsEventActive(false);
        
        // Si on est avant le premier weekend, compter jusqu'au 6 décembre
        if (now < weekend1Start) {
          const diff = weekend1Start.getTime() - now.getTime();
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeRemaining(`${hours}h ${minutes}m`);
        }
        // Si on est entre les deux weekends, compter jusqu'au 13 décembre
        else if (now > weekend1End && now < weekend2Start) {
          const diff = weekend2Start.getTime() - now.getTime();
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeRemaining(`${hours}h ${minutes}m`);
        }
        // Après le deuxième weekend
        else {
          setTimeRemaining('');
        }
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
            
            {/* Event link hidden
            <div className={styles.eventLinkContainer}>
              {isEventActive ? (
                <span className={styles.nowBadge}>NOW</span>
              ) : timeRemaining ? (
                <span className={styles.countdownBadge}>{timeRemaining}</span>
              ) : (
                <span className={styles.newBadge}>SOON</span>
              )}
              <Link href="/event" className={styles.navLink}>
                Event
              </Link>
            </div>
            */}

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
