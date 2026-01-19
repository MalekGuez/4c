"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthContext } from '../contexts/AuthContext';
import { apiRequest, API_ENDPOINTS, MoonstonesResponse, couponService, referralService } from '../services/api';
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
  const [couponCode, setCouponCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [myReferralCode, setMyReferralCode] = useState<string>('');
  const [usedReferralCode, setUsedReferralCode] = useState<string | null>(null);
  const [isUsingReferral, setIsUsingReferral] = useState(false);
  const [isLoadingReferralCode, setIsLoadingReferralCode] = useState(false);
  const [activeView, setActiveView] = useState<'default' | 'coupon' | 'referral'>('default');

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle navigation - show specific section based on query param or hash
  useEffect(() => {
    if (!isMounted) return;

    const checkView = () => {
      // Check query parameter first
      const urlParams = new URLSearchParams(window.location.search);
      const viewParam = urlParams.get('view');
      
      if (viewParam === 'coupon') {
        setActiveView('coupon');
      } else if (viewParam === 'referral') {
        setActiveView('referral');
      } else {
        // Fallback to hash if no query param
        const hash = window.location.hash;
        if (hash === '#coupon-section') {
          setActiveView('coupon');
        } else if (hash === '#referral-section') {
          setActiveView('referral');
        } else {
          setActiveView('default');
        }
      }
    };

    // Check on mount
    checkView();

    // Listen for hash changes (backward compatibility)
    const handleHashChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (!urlParams.get('view')) {
        checkView();
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', checkView);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', checkView);
    };
  }, [isMounted]);

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
        
        // Fetch user's referral code
        setIsLoadingReferralCode(true);
        const referralResponse = await referralService.getReferralCode();
        if (referralResponse.success && referralResponse.referralCode) {
          setMyReferralCode(referralResponse.referralCode);
        }
        setIsLoadingReferralCode(false);
        
        // Fetch used referral code
        const usedReferralResponse = await referralService.getUsedReferralCode();
        if (usedReferralResponse.success && usedReferralResponse.referralCode) {
          setUsedReferralCode(usedReferralResponse.referralCode);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setIsLoadingReferralCode(false);
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

  const handleRedeemCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setIsRedeeming(true);
    setError('');
    setMessage('');

    try {
      const response = await couponService.redeemCoupon(couponCode.trim());
      
      if (response.success) {
        if (response.items && response.items.length > 0) {
          const itemsList = response.items.map((item: any) => `ID ${item.itemId} × ${item.itemCount}`).join(', ');
          setMessage(`Coupon redeemed successfully! You received: ${itemsList}`);
        } else {
          setMessage(response.message || 'Coupon redeemed successfully!');
        }
        setCouponCode('');
        // Refresh moonstones in case the coupon gave moonstones
        const msResponse = await apiRequest<MoonstonesResponse>(API_ENDPOINTS.MOONSTONES, {
          method: 'GET',
        });
        if (msResponse.success && msResponse.data) {
          setMoonstones(msResponse.data.moonstones);
        }
      } else {
        setError(response.error || 'Failed to redeem coupon');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleUseReferralCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!referralCode.trim()) {
      setError('Please enter a referral code');
      return;
    }

    setIsUsingReferral(true);
    setError('');
    setMessage('');

    try {
      const response = await referralService.useReferralCode(referralCode.trim());
      
      if (response.success) {
        setMessage(response.message || 'Referral code used successfully!');
        setReferralCode('');
        // Update used referral code
        setUsedReferralCode(referralCode.trim().toUpperCase());
      } else {
        setError(response.error || 'Failed to use referral code');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsUsingReferral(false);
    }
  };

  const handleGenerateReferralCode = async () => {
    setIsLoadingReferralCode(true);
    setError('');
    setMessage('');

    try {
      const response = await referralService.getReferralCode();
      
      if (response.success && response.referralCode) {
        setMyReferralCode(response.referralCode);
        setMessage('Referral code generated successfully!');
      } else {
        setError(response.error || 'Failed to generate referral code');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoadingReferralCode(false);
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
        {/* Show default view (Details + Actions) only when activeView is 'default' */}
        {activeView === 'default' && (
          <>
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

            {/* Actions Section */}
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
                <button 
                  className={styles.actionButton}
                  onClick={() => setActiveView('coupon')}
                >
                  Coupon
                </button>
                <button 
                  className={styles.actionButton}
                  onClick={() => setActiveView('referral')}
                >
                  Referral
                </button>
            </div>
          </div>
          </>
        )}

        {/* Messages - Always visible */}
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

        {/* Coupon Section - Only visible when activeView is 'coupon' */}
        {activeView === 'coupon' && (
          <div id="coupon-section" className={styles.couponSection}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Redeem Coupon</h3>
              <button 
                className={styles.actionButton}
                onClick={() => {
                  setActiveView('default');
                  setMessage('');
                  setError('');
                }}
              >
                Back
              </button>
            </div>
            <form onSubmit={handleRedeemCoupon} className={styles.couponForm}>
              <div className={styles.couponInputGroup}>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className={styles.couponInput}
                  disabled={isRedeeming}
                  maxLength={50}
                />
                <button
                  type="submit"
                  className={styles.couponButton}
                  disabled={isRedeeming || !couponCode.trim()}
                >
                  {isRedeeming ? 'Redeeming...' : 'Redeem'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Referral Section - Only visible when activeView is 'referral' */}
        {activeView === 'referral' && (
          <div id="referral-section" className={styles.couponSection}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Referral Code</h3>
              <button 
                className={styles.actionButton}
                onClick={() => {
                  setActiveView('default');
                  setMessage('');
                  setError('');
                }}
              >
                Back
              </button>
            </div>
            
            {/* Introduction text */}
            <div style={{ marginBottom: '30px', color: '#BDBDBD', lineHeight: '1.2' }}>
              <p style={{ marginBottom: '8px' }}>
                Share your referral code with friends! When a player you invited reaches 20 hours of gameplay, both of you will receive 100 Moonstones. 
              </p>
              <p style={{ margin: 0 }}>
                The more players you invite, the greater the rewards become!
              </p>
            </div>
            
            {/* Display user's own referral code */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#BDBDBD' }}>Your Referral Code:</label>
              <div>
                {isLoadingReferralCode ? (
                  <span style={{ color: '#BDBDBD' }}>Loading...</span>
                ) : myReferralCode && myReferralCode !== 'N/A' ? (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px'
                  }}>
                    <code style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold', 
                      letterSpacing: '2px',
                      color: '#FFFFFF'
                    }}>
                      {myReferralCode}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(myReferralCode);
                        setMessage('Referral code copied to clipboard!');
                        setTimeout(() => setMessage(''), 3000);
                      }}
                      className={styles.actionButton}
                      style={{
                        padding: '8px 16px',
                        fontSize: '12px'
                      }}
                    >
                      Copy
              </button>
                  </div>
                ) : (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px'
                  }}>
                    <code style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold', 
                      letterSpacing: '2px',
                      color: '#FFFFFF'
                    }}>
                      You don't have a referral code
                    </code>
                    <button
                      onClick={handleGenerateReferralCode}
                      className={styles.actionButton}
                      disabled={isLoadingReferralCode}
                      style={{
                        padding: '8px 16px',
                        fontSize: '12px'
                      }}
                    >
                      {isLoadingReferralCode ? 'Generating...' : 'Generate'}
              </button>
            </div>
                )}
        </div>
            </div>

            {/* Use referral code form */}
            <form onSubmit={handleUseReferralCode} className={styles.couponForm}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#BDBDBD' }}>Enter Referral Code:</label>
              <div className={styles.couponInputGroup}>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="Enter referral code"
                  className={styles.couponInput}
                  disabled={isUsingReferral}
                  maxLength={20}
                />
                <button
                  type="submit"
                  className={styles.couponButton}
                  disabled={isUsingReferral || !referralCode.trim()}
                >
                  {isUsingReferral ? 'Using...' : 'Use Code'}
                </button>
              </div>
            </form>

            {/* Display used referral code */}
            {usedReferralCode && (
              <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(189, 189, 189, 0.3)' }}>
                <div style={{ color: '#BDBDBD', fontSize: '14px', marginBottom: '8px' }}>Used Code:</div>
                <code style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  letterSpacing: '2px',
                  color: '#FFFFFF'
                }}>
                  {usedReferralCode}
                </code>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </AuthGuard>
  );
}
