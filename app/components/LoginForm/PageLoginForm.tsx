"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthContext } from '../../contexts/AuthContext';
import styles from '../../styles/auth.module.css';

interface PageLoginFormProps {
  onSwitchToRegister: () => void;
}

export default function PageLoginForm({ onSwitchToRegister }: PageLoginFormProps) {
  const { login, isLoading, error, clearError } = useAuthContext();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const result = await login(formData);
    if (result.success) {
      console.log('Login successful!');
      router.push('/');
    } else {
      console.log('Login failed:', result.error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className={styles.authPageContainer}>
      <div className={styles.authContentWrapper}>
        <div className={styles.authHeader}>
          <Image
            src="/images/titles/Login.png"
            alt="Login"
            width={161}
            height={73}
            className={styles.authTitleImage}
          />
          <p>Don't have an account yet? <button onClick={onSwitchToRegister} className={styles.authSwitchButton}>Create one!</button></p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.authForm}>
          {error && (
            <div className={styles.authErrorMessage}>
              {error}
            </div>
          )}
          
          <div className={styles.authInputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Enter your email"
            />
          </div>
          
          <div className={styles.authInputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Enter your password"
            />
            <div className={styles.forgotPasswordLink}>
              <button type="button" className={styles.authSwitchButton}>
                Forgot your password?
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className={styles.authSubmitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
      </div>
    </div>
  );
}
