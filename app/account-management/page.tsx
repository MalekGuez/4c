"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthContext } from '../contexts/AuthContext';
import { apiRequest, API_ENDPOINTS, MoonstonesResponse } from '../services/api';
import AuthGuard from '../components/AuthGuard';
import styles from './accountManagement.module.css';

export default function AccountManagementPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthContext();
  const [moonstones, setMoonstones] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {        
        const response = await apiRequest<MoonstonesResponse>(API_ENDPOINTS.MOONSTONES, {
          method: 'GET',
        });
        if (response.success && response.data) {
          setMoonstones(response.data.moonstones);
        }
        
        // Check email verification status from user context
        if (user) {
          setIsEmailVerified(user.verified || false);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated, user]);

  const handleResendEmail = async () => {
    setIsResending(true);
    setError('');
    setMessage('');

    try {
      const response = await apiRequest(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, {
        method: 'POST'
      });

      if (response.success) {
        setMessage('Verification email sent successfully!');
      } else {
        setError(response.error || 'Failed to send verification email');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // Show loading state until component is mounted and auth is loaded
  if (!isMounted || authLoading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className={styles.pageContainer}>
      {/* Account Management Bar */}
      <div className={styles.accountBar}>
        <Image
          src="/images/titles/Account-Management.png"
          alt="Account Management"
          width={678}
          height={72}
          className={styles.accountTitle}
        />
        <div className={styles.bar}>
          <Image
            src="/images/titles/Bar.png"
            alt="Bar"
            width={991}
            height={8}
            className={styles.barImage}
            priority
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </div>

      <div className={styles.contentWrapper}>
        {/* Details Section - Full Width */}
        <div className={styles.detailsSection}>
          <h2 className={styles.sectionTitle}>Details</h2>
          <div className={styles.userInfoSection}>
            <div className={styles.userEmail}>
              <span className={styles.emailLabel}>Email:</span>
              <span className={styles.emailValue}>{user?.email || 'N/A'}</span>
            </div>
            <div className={styles.moonstonesDisplay}>
              <Image
                src="/images/icons/Moonstones.png"
                alt="Moonstones"
                width={20}
                height={18}
                className={styles.moonstonesIcon}
              />
              <span className={styles.moonstonesLabel}>Moonstones:</span>
              <span className={styles.moonstonesText}>
                {isLoading ? 'Loading...' : moonstones.toLocaleString()}
              </span>
            </div>
          </div>
          
          {/* Account Status */}
          <div className={styles.accountStatusSection}>
            <div className={styles.statusInfo}>
              <span className={styles.statusLabel}>Account Status:</span>
              <span className={styles.statusValue}>
                {isEmailVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className={styles.successMessage}>
            {message}
          </div>
        )}
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Two Column Layout */}
        <div className={styles.twoColumnLayout}>
          {/* Account Actions */}
          <div className={styles.actionSection}>
            <h3 className={styles.sectionTitle}>Actions</h3>
            <div className={styles.actionButtons}>
              {!isEmailVerified && (
                <button 
                  className={styles.actionButton}
                  onClick={handleResendEmail}
                  disabled={isResending}
                >
                  {isResending ? 'Sending...' : 'Resend Email Confirmation'}
                </button>
              )}
              <Link href="/change-password" className={styles.actionButton}>
                Change Password
              </Link>
              <Link href="/tickets" className={styles.actionButton}>
                Support
              </Link>
            </div>
          </div>

          {/* Account History - Hidden for now, will be displayed later */}
          {/* <div className={styles.historySection}>
            <h3 className={styles.sectionTitle}>History</h3>
            <div className={styles.historyButtons}>
              <button className={styles.historyButton}>
                Login History
              </button>
              <button className={styles.historyButton}>
                Payment History
              </button>
              <button className={styles.historyButton}>
                Ban History
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}
