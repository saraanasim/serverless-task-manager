import type { AuthUser, SignUpOutput } from 'aws-amplify/auth';
import { createContext, useContext } from 'react';

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
  
    // Auth methods
    signUpUser: (email: string, password: string) => Promise<SignUpOutput>;
    confirmSignUpUser: (email: string, code: string) => Promise<void>;
    signInUser: (email: string, password: string) => Promise<void>;
    signOutUser: () => Promise<void>;
    resendConfirmationCode: (email: string) => Promise<void>;
    clearError: () => void;
  
    // Helper
    isAuthenticated: boolean;
  }

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
