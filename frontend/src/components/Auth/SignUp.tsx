import React, { useState } from 'react';
    import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUpUser, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  // Validate form
  const validateForm = (): boolean => {
    setLocalError('');
    clearError();

    if (!email || !password || !confirmPassword) {
      setLocalError('All fields are required');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Please enter a valid email address');
      return false;
    }

    // Password validation (must match your Cognito policy)
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long');
      return false;
    }

    if (!/[a-z]/.test(password)) {
      setLocalError('Password must contain at least one lowercase letter');
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      setLocalError('Password must contain at least one uppercase letter');
      return false;
    }

    if (!/[0-9]/.test(password)) {
      setLocalError('Password must contain at least one number');
      return false;
    }

    // Confirm password match
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const result = await signUpUser(email, password);

      // If sign up successful, show verification step
      if (result.isSignUpComplete === false) {
        setShowVerification(true);
      }
    } catch (err) {
      console.error('Sign up failed:', err);
      // Error is handled by context
    } finally {
      setLoading(false);
    }
  };

  // If sign up successful, redirect to verification
  if (showVerification) {
    navigate('/confirm-signup', { state: { email } });
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Sign Up</h1>
        <p style={styles.subtitle}>Create your account</p>

        {(error || localError) && (
          <div style={styles.errorBox}>
            {error || localError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={styles.input}
              disabled={loading}
            />
            <small style={styles.hint}>
              At least 8 characters with uppercase, lowercase, and number
            </small>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              style={styles.input}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={styles.footer}>
          <p>
            Already have an account?{' '}
            <Link to="/signin" style={styles.link}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Simple inline styles (replace with CSS or styled-components in production)
const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    marginBottom: '24px',
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '500',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  hint: {
    display: 'block',
    marginTop: '4px',
    fontSize: '12px',
    color: '#666',
  },
  button: {
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '8px',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '14px',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default SignUp;