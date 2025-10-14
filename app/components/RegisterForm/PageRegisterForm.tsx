"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthContext } from '../../contexts/AuthContext';
import styles from '../../styles/auth.module.css';

interface PageRegisterFormProps {
  onSwitchToLogin: () => void;
}

export default function PageRegisterForm({ onSwitchToLogin }: PageRegisterFormProps) {
  const { register, isLoading, error, clearError } = useAuthContext();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showUsernameField, setShowUsernameField] = useState(false);

  const validateForm = () => {
    const errors: string[] = [];
    
    // Validate email format (must be: text@text.text)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address (e.g., user@example.com)');
    }
    
    // Check if email contains special character (-)
    if (formData.email.includes('-')) {
      if (!formData.username || formData.username.trim().length === 0) {
        errors.push('Username is required when email contains special characters (-)');
      } else if (formData.username.includes('-') || formData.username.includes('@')) {
        errors.push('Username cannot contain special characters (- or @)');
      }
    }
    
    if (formData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationErrors([]);
    setSuccessMessage('');
    
    if (!validateForm()) {
      return;
    }
    
    const result = await register({
      email: formData.email,
      username: formData.username || undefined, // Send username only if provided
      password: formData.password,
    });
    
    if (result.success) {
      setSuccessMessage('Account created! Please check your email to confirm your account.');
      setValidationErrors([]);
      setFormData({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
      });
      setShowUsernameField(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Check if email contains "-" and show username field
    if (name === 'email' && value.includes('-')) {
      setShowUsernameField(true);
    } else if (name === 'email' && !value.includes('-')) {
      setShowUsernameField(false);
    }
    
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  return (
    <div className={styles.authPageContainer}>
      <div className={styles.authContentWrapper}>
        <div className={styles.authHeader}>
          <Image
            src="/images/titles/Register.png"
            alt="Register"
            width={278}
            height={73}
            className={styles.authTitleImage}
          />
          <p>Fill the information below to create your account, and join the 4Chaos community!</p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.authForm}>
          {(error || validationErrors.length > 0) && (
            <div className={styles.authErrorMessage}>
              {error || validationErrors.join(', ')}
            </div>
          )}
          
          {successMessage && (
            <div style={{ 
              backgroundColor: '#d4edda', 
              color: '#155724', 
              padding: '10px', 
              borderRadius: '5px', 
              marginBottom: '15px',
              border: '1px solid #c3e6cb'
            }}>
              {successMessage}
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
              placeholder="Enter your email address"
            />
          </div>
          
          {showUsernameField && (
            <>
              <div style={{ 
                backgroundColor: '#f8d7da', 
                color: '#721c24', 
                padding: '12px', 
                borderRadius: '5px', 
                marginBottom: '15px',
                border: '1px solid #f5c6cb',
                fontSize: '14px'
              }}>
                ⚠️ <strong>Important:</strong> Your email contains a special character (-). Please provide a username that you will use to <strong>login</strong> from now on. This username will be your game login ID.
              </div>
              <div className={styles.authInputGroup}>
                <label htmlFor="username">Login Username (required)</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required={showUsernameField}
                  disabled={isLoading}
                  placeholder="Choose your login username (no special characters)"
                />
              </div>
            </>
          )}
          
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
              placeholder="Create a password"
            />
          </div>
          
          <div className={styles.authInputGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Confirm your password"
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.authSubmitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
      </div>
    </div>
  );
}
