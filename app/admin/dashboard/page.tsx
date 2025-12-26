'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './dashboard.module.css';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [manager, setManager] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminManager = localStorage.getItem('adminManager');

    if (!adminToken || !adminManager) {
      router.push('/admin/login');
      return;
    }

    try {
      setManager(JSON.parse(adminManager));
    } catch (error) {
      router.push('/admin/login');
      return;
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminManager');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header Bar */}
      <div className={styles.headerBar}>
        <Image
          src="/images/titles/Account-Management.png"
          alt="Admin Dashboard"
          width={678}
          height={72}
          className={styles.titleImage}
        />
        <div className={styles.bar}>
          <Image
            src="/images/titles/Bar.png"
            alt="Bar"
            width={500}
            height={50}
            className={styles.barImage}
            priority
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </div>

      <div className={styles.contentWrapper}>
        {/* Welcome Section */}
        <div className={styles.welcomeSection}>
          <div className={styles.welcomeInfo}>
            <h2>Welcome, {manager?.szName}</h2>
            <p>Authority Level: {manager?.bAuthority}</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>

        {/* Admin Actions Grid */}
        <div className={styles.adminGrid}>
          <Link href="/admin/tickets" className={styles.adminCard}>
            <h3>Tickets Management</h3>
            <p>Manage player tickets, respond to inquiries, and handle support requests.</p>
          </Link>

          {manager && manager.bAuthority !== 5 && (
            <Link href="/admin/players" className={styles.adminCard}>
              <h3>Players Management</h3>
              <p>Search players, view profiles, and apply sanctions (bans, kicks, warns).</p>
            </Link>
          )}

          {manager && manager.bAuthority !== 5 && manager.bAuthority !== 4 && (
            <Link href="/admin/news" className={styles.adminCard}>
              <h3>News Management</h3>
              <p>Create, edit, and delete news announcements and updates.</p>
            </Link>
          )}

          {manager && manager.bAuthority !== 5 && manager.bAuthority !== 4 && (
            <Link href="/admin/coupons" className={styles.adminCard}>
              <h3>Coupon Management</h3>
              <p>Create and manage coupon codes for players to redeem items.</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
