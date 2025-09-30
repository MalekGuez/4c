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
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.email.includes('@')) {
      errors.push('Please enter a valid email address');
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
      password: formData.password,
    });
    
    if (result.success) {
      // Afficher un message de succès au lieu de rediriger
      setSuccessMessage('Account created! Please check your email to confirm your account.');
      setValidationErrors([]);
      // Vider le formulaire
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    
    // Clear validation errors and success message when user starts typing
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
