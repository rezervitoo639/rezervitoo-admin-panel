import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "../../api/index";
import styles from "./VerifyEmail.module.css";

interface VerificationState {
  status: "verifying" | "success" | "error";
  message: string;
}

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState<VerificationState>({
    status: "verifying",
    message: "Verifying your email...",
  });

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setState({
          status: "error",
          message: "Invalid verification link. No token provided.",
        });
        return;
      }

      try {
        const response = await apiClient.post("/users/verify-email/", {
          token,
        });

        setState({
          status: "success",
          message: response.data.message || "Email verified successfully!",
        });

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login", {
            state: {
              message: "Email verified! Please log in with your credentials.",
            },
          });
        }, 3000);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error ||
          "Verification failed. The link may be expired or invalid.";

        setState({
          status: "error",
          message: errorMessage,
        });
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  const handleResendEmail = () => {
    navigate("/login", {
      state: {
        showResendVerification: true,
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          {state.status === "verifying" && (
            <div className={styles.spinner}></div>
          )}
          {state.status === "success" && (
            <svg className={styles.successIcon} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"
              />
            </svg>
          )}
          {state.status === "error" && (
            <svg className={styles.errorIcon} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"
              />
            </svg>
          )}
        </div>

        <h1 className={styles.title}>
          {state.status === "verifying" && "Verifying Email"}
          {state.status === "success" && "Email Verified!"}
          {state.status === "error" && "Verification Failed"}
        </h1>

        <p className={styles.message}>{state.message}</p>

        {state.status === "success" && (
          <p className={styles.redirect}>Redirecting to login page...</p>
        )}

        {state.status === "error" && (
          <div className={styles.actions}>
            <button onClick={handleResendEmail} className={styles.button}>
              Request New Verification Link
            </button>
            <button
              onClick={() => navigate("/login")}
              className={`${styles.button} ${styles.secondary}`}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
