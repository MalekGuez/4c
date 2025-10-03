"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiRequest, API_ENDPOINTS } from '../services/api';
import styles from '../styles/auth.module.css';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await apiRequest(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (response.success) {
        setMessage(response.data?.message || 'Password reset email sent successfully!');
      } else {
        setError(response.error || 'Failed to send reset email');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            Forgot Password
          </h1>
          <p style={{ color: '#BDBDBD', textAlign: 'center', marginBottom: '30px' }}>
            Enter your email address and we'll send you a link to reset your password.
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
            </div>
          )}
          
          <div className={styles.authInputGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter your email address"
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.authSubmitButton}
            disabled={isLoading || !email}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
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
