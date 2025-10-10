"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/auth.module.css';
import { API_CONFIG } from '../../config/api';

export default function ConfirmEmailPage() {
  const params = useParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/confirm-email/${params.token}`, {
          method: 'GET',
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.error || 'Email confirmation failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Network error. Please try again.');
      }
    };

    if (params.token) {
      confirmEmail();
    }
  }, [params.token]);

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
            Email Confirmation
          </h1>
        </div>
        
        <div className={styles.authForm}>
          {status === 'loading' && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              color: '#BDBDBD',
              fontSize: '18px'
            }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid #333',
                  borderTop: '3px solid #790801',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 20px auto'
                }}
              />
              <p>Confirming your email...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div style={{ 
              backgroundColor: 'transparent', 
              color: '#BDBDBD', 
              padding: '0'
            }}>
              <h3 style={{ 
                color: '#790801', 
                fontSize: '24px', 
                marginBottom: '20px',
                fontFamily: 'TheBlowar, sans-serif',
                fontWeight: '400'
              }}>
                Your email has been successfully confirmed!
              </h3>
              <p style={{ fontSize: '16px', marginBottom: '30px' }}>
                Welcome to 4Chaos! You can now log in to your account.
              </p>
              <Link href="/login" style={{
                display: 'inline-block',
                backgroundColor: '#790801',
                color: 'white',
                padding: '15px 30px',
                textDecoration: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'background-color 0.3s ease'
              }}>
                Go to Login
              </Link>
            </div>
          )}
          
          {status === 'error' && (
            <div style={{ 
              backgroundColor: 'transparent', 
              color: '#BDBDBD', 
              padding: '0', 
              textAlign: 'center'
            }}>
              <h3 style={{ 
                color: '#ff6b6b', 
                fontSize: '24px', 
                marginBottom: '20px',
                fontFamily: 'TheBlowar, sans-serif',
                fontWeight: '400'
              }}>
                ❌ Confirmation Failed
              </h3>
              <p style={{ fontSize: '16px', marginBottom: '30px' }}>
                {message}
              </p>
              <Link href="/register" style={{
                display: 'inline-block',
                backgroundColor: '#790801',
                color: 'white',
                padding: '15px 30px',
                textDecoration: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'background-color 0.3s ease'
              }}>
                Try Again
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
