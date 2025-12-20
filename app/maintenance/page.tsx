'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './maintenance.module.css';

export default function MaintenancePage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(14, 0, 0, 0);
      
      const difference = tomorrow.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <Image
            src="/images/Logo.png"
            alt="4Chaos Logo"
            width={312}
            height={100}
            priority
          />
        </div>

        <h1 className={styles.title}>Release Date</h1>
        
        <p className={styles.description}>
          The server will be available soon. Our gates are almost ready to open.
        </p>

        <div className={styles.countdown}>
          <p className={styles.countdownLabel}>Server opens in:</p>
          <div className={styles.countdownTimer}>
            <div className={styles.timeBlock}>
              <span className={styles.timeValue}>{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className={styles.timeLabel}>Hours</span>
            </div>
            <span className={styles.timeSeparator}>:</span>
            <div className={styles.timeBlock}>
              <span className={styles.timeValue}>{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className={styles.timeLabel}>Minutes</span>
            </div>
            <span className={styles.timeSeparator}>:</span>
            <div className={styles.timeBlock}>
              <span className={styles.timeValue}>{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className={styles.timeLabel}>Seconds</span>
            </div>
          </div>
        </div>

        <div className={styles.info}>
          <p>Test your skills, challenge others, and discover what makes 4Chaos the best PvP adventure out there.</p>
        </div>

        <div className={styles.socialLinks}>
          <p className={styles.followText}>Join our community for updates:</p>
          <div className={styles.socialButtons}>
            <a 
              href="https://discord.gg/4Chaos" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.discordButton}
            >
              <svg 
                className={styles.socialIcon}
                viewBox="0 0 24 24" 
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Discord
            </a>
            
            <a 
              href="https://www.youtube.com/@4ChaosOfficial" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.youtubeButton}
            >
              <svg 
                className={styles.socialIcon}
                viewBox="0 0 24 24" 
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube
            </a>
          </div>
        </div>

        <div className={styles.footer}>
          <p>© 2025 4Chaos. All rights reserved.</p>
        </div>
      </div>

    </div>
  );
}
