'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { adminService } from '@/app/services/api';
import styles from './referrals.module.css';

export default function AdminReferralsPage() {
  const router = useRouter();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReferrer, setSelectedReferrer] = useState<any>(null);
  const [showUsage, setShowUsage] = useState(false);
  const [usage, setUsage] = useState<any[]>([]);
  const [loadingUsage, setLoadingUsage] = useState(false);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin/login');
      return;
    }

    loadReferrals();
  }, [router]);

  const loadReferrals = async () => {
    try {
      setLoading(true);
      const response = await adminService.getReferrals();
      
      if (response.success && response.referrals) {
        setReferrals(response.referrals);
      } else {
        setError(response.error || 'Failed to load referrals');
      }
    } catch (err) {
      setError('An error occurred while loading referrals');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUsage = async (referrer: any) => {
    setSelectedReferrer(referrer);
    setShowUsage(true);
    setLoadingUsage(true);
    setUsage([]);

    try {
      const response = await adminService.getReferralUsage(referrer.dwUserId);
      if (response.success && response.usage) {
        setUsage(response.usage);
      } else {
        setError(response.error || 'Failed to load usage details');
      }
    } catch (err) {
      setError('An error occurred while loading usage details');
    } finally {
      setLoadingUsage(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>Loading referrals...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerBar}>
        <Image
          src="/images/titles/Referrals.png"
          alt="Admin Referrals"
          width={330}
          height={85}
          quality={100}
          className={styles.titleImage}
        />
        <div className={styles.bar}>
          <Image
            src="/images/titles/Bar.png"
            alt="Bar"
            width={991}
            height={8}
            className={styles.barImage}
            priority
          />
        </div>
      </div>

      <div className={styles.contentWrapper}>
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        <div className={styles.statsSection}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{referrals.length}</div>
            <div className={styles.statLabel}>Total Referrers</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {referrals.reduce((sum, r) => sum + (r.usageCount || 0), 0)}
            </div>
            <div className={styles.statLabel}>Total Referrals Used</div>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.referralsTable}>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Referral Code</th>
                <th>Created Date</th>
                <th>Usage Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.noData}>
                    No referrals found
                  </td>
                </tr>
              ) : (
                referrals.map((referrer) => (
                  <tr key={referrer.id}>
                    <td>{referrer.dwUserId}</td>
                    <td>{referrer.username || 'N/A'}</td>
                    <td>{referrer.email || 'N/A'}</td>
                    <td>
                      <code className={styles.referralCode}>{referrer.szReferralCode}</code>
                    </td>
                    <td>{formatDate(referrer.dCreatedDate)}</td>
                    <td>
                      <span className={styles.usageCount}>{referrer.usageCount || 0}</span>
                    </td>
                    <td>
                      <button
                        className={styles.viewButton}
                        onClick={() => handleViewUsage(referrer)}
                      >
                        View Usage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showUsage && selectedReferrer && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>Referral Usage Details</h2>
                <button
                  className={styles.closeButton}
                  onClick={() => {
                    setShowUsage(false);
                    setSelectedReferrer(null);
                    setUsage([]);
                  }}
                >
                  ×
                </button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.referrerInfo}>
                  <p><strong>Referrer:</strong> {selectedReferrer.username} ({selectedReferrer.email})</p>
                  <p><strong>Referral Code:</strong> <code>{selectedReferrer.szReferralCode}</code></p>
                  <p><strong>Total Uses:</strong> {selectedReferrer.usageCount || 0}</p>
                </div>

                {loadingUsage ? (
                  <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <div className={styles.loadingText}>Loading usage details...</div>
                  </div>
                ) : usage.length === 0 ? (
                  <div className={styles.noData}>
                    No one has used this referral code yet.
                  </div>
                ) : (
                  <table className={styles.usageTable}>
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Used Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usage.map((u) => (
                        <tr key={u.id}>
                          <td>{u.dwUserId}</td>
                          <td>{u.username || 'N/A'}</td>
                          <td>{u.email || 'N/A'}</td>
                          <td>{formatDate(u.dUsedDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

