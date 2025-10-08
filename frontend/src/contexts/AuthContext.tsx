import {
    confirmSignUp,
    getCurrentUser,
    resendSignUpCode,
    signIn,
    signOut,
    signUp,
    type AuthUser,
    type SignUpOutput,
} from 'aws-amplify/auth';
import React, { useEffect, useState } from 'react';
import { AuthContext } from '../hooks/useAuth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in (on mount)
  useEffect(() => {
    checkCurrentUser();
  }, []);

  // Check current authenticated user
  const checkCurrentUser = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.log('No authenticated user:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Sign up new user
  const signUpUser = async (
    email: string,
    password: string
  ): Promise<SignUpOutput> => {
    try {
      setError(null);
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });
      return result;
    } catch (err: unknown) {
      console.error('Sign up error:', err);
      const error = err as Error;
      setError(error.message || 'Failed to sign up');
      throw err;
    }
  };

  // Confirm sign up with verification code
  const confirmSignUpUser = async (
    email: string,
    code: string
  ): Promise<void> => {
    try {
      setError(null);
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
    } catch (err: unknown) {
      console.error('Confirmation error:', err);
      const error = err as Error;
      setError(error.message || 'Failed to confirm sign up');
      throw err;
    }
  };

  // Sign in existing user
  const signInUser = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      const result = await signIn({
        username: email,
        password,
      });
      
      // If sign in successful, get current user
      if (result.isSignedIn) {
        await checkCurrentUser();
      }
    } catch (err: unknown) {
      console.error('Sign in error:', err);
      
      // Handle specific error cases
      const error = err as Error;
      if (error.name === 'UserNotConfirmedException') {
        setError('Please verify your email before signing in');
      } else if (error.name === 'NotAuthorizedException') {
        setError('Incorrect email or password');
      } else if (error.name === 'UserNotFoundException') {
        setError('User not found. Please sign up first');
      } else {
        setError(error.message || 'Failed to sign in');
      }
      
      throw err;
    }
  };

  // Sign out current user
  const signOutUser = async (): Promise<void> => {
    try {
      setError(null);
      await signOut();
      setUser(null);
    } catch (err: unknown) {
      console.error('Sign out error:', err);
      const error = err as Error;
      setError(error.message || 'Failed to sign out');
      throw err;
    }
  };

  // Resend verification code
  const resendConfirmationCode = async (email: string): Promise<void> => {
    try {
      setError(null);
      await resendSignUpCode({
        username: email,
      });
    } catch (err: unknown) {
      console.error('Resend code error:', err);
      const error = err as Error;
      setError(error.message || 'Failed to resend verification code');
      throw err;
    }
  };

  // Clear error message
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    signUpUser,
    confirmSignUpUser,
    signInUser,
    signOutUser,
    resendConfirmationCode,
    clearError,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};