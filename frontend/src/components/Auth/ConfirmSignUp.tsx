import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ConfirmSignUp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { confirmSignUpUser, resendConfirmationCode, error, clearError } = useAuth();

  // Get email from navigation state
  const emailFromState = (location.state as { email: string })?.email || '';

  const [email, setEmail] = useState(emailFromState);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();
    setSuccessMessage('');

    if (!email || !code) {
      setLocalError('Email and verification code are required');
      return;
    }

    try {
      setLoading(true);
      await confirmSignUpUser(email, code);
      setSuccessMessage('Email verified successfully! Redirecting to sign in...');
      
      // Redirect to sign in after 2 seconds
      setTimeout(() => {
        navigate('/signin', { state: { email } });
      }, 2000);
    } catch (err) {
      console.error('Verification failed:', err);
      // Error is handled by context
    } finally {
      setLoading(false);
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    setLocalError('');
    clearError();
    setSuccessMessage('');

    if (!email) {
      setLocalError('Please enter your email address');
      return;
    }

    try {
      setResending(true);
      await resendConfirmationCode(email);
      setSuccessMessage('Verification code sent! Check your email.');
    } catch (err) {
      console.error('Resend failed:', err);
      // Error is handled by context
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Verify Email</h1>
        <p style={styles.subtitle}>
          We've sent a verification code to your email. Please enter it below.
        </p>

        {(error || localError) && (
          <div style={styles.errorBox}>
            {error || localError}
          </div>
        )}

        {successMessage && (
          <div style={styles.successBox}>
            {successMessage}
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
              disabled={loading || resending}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="code" style={styles.label}>
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              style={styles.input}
              disabled={loading || resending}
              maxLength={6}
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading || resending}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div style={styles.resendSection}>
          <p style={styles.resendText}>Didn't receive the code?</p>
          <button
            onClick={handleResendCode}
            style={styles.linkButton}
            disabled={loading || resending}
          >
            {resending ? 'Sending...' : 'Resend Code'}
          </button>
        </div>

        <div style={styles.footer}>
          <Link to="/signin" style={styles.link}>
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

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
    fontSize: '14px',
  },
  errorBox: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  successBox: {
    backgroundColor: '#efe',
    color: '#2a2',
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
  resendSection: {
    marginTop: '16px',
    textAlign: 'center',
  },
  resendText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '14px',
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

export default ConfirmSignUp;