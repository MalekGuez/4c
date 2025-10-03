"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiRequest, API_ENDPOINTS } from '../../services/api';
import styles from '../../styles/auth.module.css';

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isValidToken, setIsValidToken] = useState(true);

  useEffect(() => {
    // Validate token exists
    if (!params.token) {
      setIsValidToken(false);
      setError('Invalid reset link');
    }
  }, [params.token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiRequest(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({
          token: params.token,
          newPassword: formData.newPassword
        }),
      });

      if (response.success) {
        setMessage(response.data?.message || 'Password reset successfully!');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(response.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className={styles.authPageContainer}>
        <div className={styles.authContentWrapper}>
          <div className={styles.authHeader}>
            <h1 style={{
              fontFamily: 'TheBlowar, sans-serif',
              fontSize: '48px',
              fontWeight: '400',
              color: '#BDBDBD',
              margin: '0 0 20px 0',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Invalid Link
            </h1>
          </div>
          
          <div style={{ textAlign: 'center', padding: '0' }}>
            <p style={{ color: '#ff6b6b', fontSize: '18px', marginBottom: '30px' }}>
              This password reset link is invalid or has expired.
            </p>
            <Link href="/forgot-password" className={styles.authSubmitButton} style={{ display: 'inline-block' }}>
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authPageContainer}>
      <div className={styles.authContentWrapper}>
        <div className={styles.authHeader}>
          <h1 style={{
            fontFamily: 'TheBlowar, sans-serif',
            fontSize: '48px',
            fontWeight: '400',
            color: '#BDBDBD',
            margin: '0 0 20px 0',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Reset Password
          </h1>
          <p style={{ color: '#BDBDBD', textAlign: 'center', marginBottom: '30px' }}>
            Enter your new password below.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.authForm}>
          {error && (
            <div className={styles.authErrorMessage}>
              {error}
            </div>
          )}
          
          {message && (
            <div style={{
              backgroundColor: 'rgba(0, 255, 0, 0.1)',
              border: '1px solid #00aa00',
              color: '#00ff00',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {message}
              <br />
              <small>Redirecting to login page...</small>
            </div>
          )}
          
          <div className={styles.authInputGroup}>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Enter your new password"
              minLength={6}
            />
          </div>
          
          <div className={styles.authInputGroup}>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Confirm your new password"
              minLength={6}
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.authSubmitButton}
            disabled={isLoading || !formData.newPassword || !formData.confirmPassword}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link href="/login" className={styles.authSwitchButton}>
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
