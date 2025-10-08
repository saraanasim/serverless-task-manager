import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOutUser } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate('/signin');
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Task Approval System</h1>
        <button onClick={handleSignOut} style={styles.signOutButton}>
          Sign Out
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.welcomeCard}>
          <h2 style={styles.welcomeTitle}>Welcome! 👋</h2>
          <p style={styles.userInfo}>
            <strong>Email:</strong> {user?.signInDetails?.loginId || user?.username || 'N/A'}
          </p>
          <p style={styles.userInfo}>
            <strong>User ID:</strong> {user?.userId || 'N/A'}
          </p>
        </div>

        <div style={styles.infoCard}>
          <h3 style={styles.cardTitle}>🎉 Authentication Complete!</h3>
          <p style={styles.cardText}>
            You have successfully signed in with AWS Cognito.
          </p>
          <p style={styles.cardText}>
            <strong>Phase 2 is complete!</strong> The authentication system is working.
          </p>
          <div style={styles.nextSteps}>
            <h4 style={styles.nextStepsTitle}>What's Next?</h4>
            <ul style={styles.list}>
              <li>✅ User authentication with Cognito</li>
              <li>✅ Email verification</li>
              <li>✅ Protected routes</li>
              <li>⏳ Phase 3: REST API with Lambda & DynamoDB</li>
              <li>⏳ Task creation and management</li>
              <li>⏳ Approval workflow</li>
            </ul>
          </div>
        </div>

        <div style={styles.tokenCard}>
          <h3 style={styles.cardTitle}>🔐 JWT Token Information</h3>
          <p style={styles.cardText}>
            Your JWT tokens are stored securely in your browser's local storage.
            Open the browser DevTools (F12) → Application → Local Storage to view them.
          </p>
          <button
            onClick={() => {
              const tokens = Object.keys(localStorage)
                .filter(key => key.includes('CognitoIdentityServiceProvider'))
                .reduce((acc, key) => {
                  acc[key] = localStorage.getItem(key);
                  return acc;
                }, {} as Record<string, string | null>);
              console.log('Cognito Tokens:', tokens);
              alert('Tokens logged to console! Press F12 to view.');
            }}
            style={styles.tokenButton}
          >
            View Tokens in Console
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  signOutButton: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  content: {
    padding: '40px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  welcomeCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#333',
  },
  userInfo: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '8px',
  },
  infoCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '12px',
    color: '#333',
  },
  cardText: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '12px',
    lineHeight: '1.6',
  },
  nextSteps: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  },
  nextStepsTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '12px',
    color: '#333',
  },
  list: {
    fontSize: '15px',
    color: '#666',
    lineHeight: '1.8',
    paddingLeft: '20px',
  },
  tokenCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  tokenButton: {
    marginTop: '12px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};

export default Dashboard;