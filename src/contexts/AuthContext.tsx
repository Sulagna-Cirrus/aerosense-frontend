import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import api from "@/config/api";

// Define types for better type safety
interface Profile {
  id: string;
  profileImage: string;
  profileImageUrl?: string;
  bio?: string;
  phone?: string;
  address?: string;
  organization?: string;
  role?: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  profile?: Profile | null;
}

interface AuthResponse {
  token: string;
  user: User;
  profile?: Profile;
}

type AuthContextType = {
  user: User | null;
  userProfile: User | null;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (fullName: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    }
    setIsLoading(false);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get<AuthResponse>('/api/auth/profile');
      setUser(response.data.user);
      setUserProfile(response.data.user);
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem('token');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      
      const response = await api.post<AuthResponse>('/api/auth/login', {
        email,
        password,
      });

      console.log('Login response received:', { 
        status: response.status,
        hasToken: !!response.data.token, 
        hasUser: !!response.data.user 
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      setUserProfile(user);

      console.log('User data set in context:', { 
        id: user.id, 
        name: user.fullName,
        hasProfile: !!user.profile 
      });

      toast({
        title: "Login successful",
        description: "Welcome back to AeroSense Dashboard",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Login error details:', { 
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message 
      });
      
      const errorMessage = error.response?.data?.message || "An error occurred during login";
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (fullName: string, email: string, password: string) => {
    try {
      // Check if the entered email already exists before trying to register
      const response = await api.post('/api/auth/signup', {
        fullName,
        email,
        password,
      });

      // Only show success toast and login if we get here (no error was thrown)
      toast({
        title: "Registration successful",
        description: "Account created successfully!",
      });
      
      // Delay slightly before attempting login to ensure backend processing completes
      setTimeout(async () => {
        try {
          await signIn(email, password);
        } catch (loginError) {
          console.error("Auto-login failed after registration:", loginError);
          // If auto-login fails, redirect to login page
          navigate("/login");
        }
      }, 500);
      
      // Successfully registered
      
    } catch (error: any) {
      // Handle specific error cases
      console.error("Signup error:", error.response?.data);
      
      let errorMessage = "An error occurred during registration";
      
      // Check specifically for email already in use error
      if (error.response?.status === 409) {
        errorMessage = "This email address is already registered. Please use a different email or login.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Re-throw the error so the component can handle it
      throw error;
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
      setUserProfile(null);
      
      navigate("/login");
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isLoading,
        setUser,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
