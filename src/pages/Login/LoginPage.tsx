import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth.tsx";
import styles from "./LoginPage.module.css";

// Google Sign-In types
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, googleLogin, user } = useAuth();

  // Initialize Google Sign-In
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        const buttonDiv = document.getElementById("googleSignInButton");
        if (buttonDiv) {
          window.google.accounts.id.renderButton(buttonDiv, {
            theme: "outline",
            size: "large",
            text: "signin_with",
            width: 350,
          });
        }
      }
    };

    // Wait for Google script to load
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      window.addEventListener("load", initializeGoogleSignIn);
      return () => window.removeEventListener("load", initializeGoogleSignIn);
    }
  }, []);

  const handleGoogleResponse = async (response: any) => {
    setError("");
    setIsLoading(true);

    try {
      await googleLogin(response.credential);
      // Don't navigate here - let useEffect handle redirect after user is fetched
    } catch (err: any) {
      console.error("Google login error:", err);

      let errorMessage = "Google sign-in failed. Please try again.";

      if (err?.response?.status === 403) {
        errorMessage =
          "Access denied. Only administrators can access this panel.";
      } else if (err?.response?.status === 400) {
        errorMessage =
          err?.response?.data?.error || "Invalid Google credentials.";
      } else if (err?.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err?.message?.includes("Network Error") || !err?.response) {
        errorMessage =
          "Cannot connect to server. Please check your internet connection.";
      } else if (err?.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ email, password });
      // Only navigate on successful login
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      console.error("Login error:", err);

      // Extract user-friendly error message
      let errorMessage = "Unable to log in. Please try again.";

      if (err?.response?.status === 401) {
        // Unauthorized - wrong credentials
        errorMessage =
          "Invalid email or password. Please check your credentials and try again.";
      } else if (err?.response?.status === 403) {
        // Forbidden - account issue
        errorMessage =
          "Your account is not authorized to access this panel. Please contact support.";
      } else if (err?.response?.status === 400) {
        // Bad request - missing fields or validation error
        errorMessage =
          err?.response?.data?.detail ||
          "Please enter valid email and password.";
      } else if (err?.response?.status >= 500) {
        // Server error
        errorMessage = "Server error. Please try again later.";
      } else if (err?.message?.includes("Network Error") || !err?.response) {
        // Network error
        errorMessage =
          "Cannot connect to server. Please check your internet connection.";
      } else if (err?.response?.data?.detail) {
        // Use backend error if available
        const detail = err.response.data.detail;
        if (detail.toLowerCase().includes("credentials")) {
          errorMessage =
            "Invalid email or password. Please check your credentials and try again.";
        } else if (detail.toLowerCase().includes("inactive")) {
          errorMessage = "Your account is inactive. Please contact support.";
        } else {
          errorMessage = detail;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Admin Login</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className={styles.divider}>
          <span className={styles.dividerText}>OR</span>
        </div>

        {/* Google Sign-In Button */}
        <div id="googleSignInButton" className={styles.googleButton}></div>
      </div>
    </div>
  );
}
