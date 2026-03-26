import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "../../api/index";
import styles from "./ResetPassword.module.css";

type PageState = "idle" | "loading" | "success" | "error";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState<PageState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const token = searchParams.get("token") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrorMessage("Invalid reset link. No token found.");
      setState("error");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      setState("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setState("error");
      return;
    }

    setState("loading");
    setErrorMessage("");

    try {
      await apiClient.post("/users/password-reset/confirm/", {
        token,
        new_password: newPassword,
      });

      setState("success");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.non_field_errors?.[0] ||
        "Failed to reset password. The link may be expired or invalid.";
      setErrorMessage(msg);
      setState("error");
    }
  };

  if (!token) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.iconContainer}>
            <svg className={styles.errorIcon} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"
              />
            </svg>
          </div>
          <h1 className={styles.title}>Invalid Link</h1>
          <p className={styles.message}>
            This password reset link is invalid. Please request a new one.
          </p>
          <div className={styles.actions}>
            <button
              onClick={() => navigate("/login")}
              className={styles.button}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.iconContainer}>
            <svg className={styles.successIcon} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"
              />
            </svg>
          </div>
          <h1 className={styles.title}>Password Reset!</h1>
          <p className={styles.message}>
            Your password has been updated successfully.
          </p>
          <p className={styles.redirect}>Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <svg className={styles.lockIcon} viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12,1C8.676,1 6,3.676 6,7V8H4V23H20V8H18V7C18,3.676 15.324,1 12,1ZM12,3C14.276,3 16,4.724 16,7V8H8V7C8,4.724 9.724,3 12,3ZM12,13A2,2 0 0,1 14,15A2,2 0 0,1 12,17A2,2 0 0,1 10,15A2,2 0 0,1 12,13Z"
            />
          </svg>
        </div>

        <h1 className={styles.title}>Reset Password</h1>
        <p className={styles.message}>Enter your new password below.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="new-password">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              className={styles.input}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (state === "error") setState("idle");
              }}
              placeholder="At least 8 characters"
              minLength={8}
              required
              autoFocus
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="confirm-password">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (state === "error") setState("idle");
              }}
              placeholder="Repeat your new password"
              required
            />
          </div>

          {state === "error" && (
            <p className={styles.errorText}>{errorMessage}</p>
          )}

          <button
            type="submit"
            className={styles.button}
            disabled={state === "loading"}
          >
            {state === "loading" ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <button
          onClick={() => navigate("/login")}
          className={`${styles.button} ${styles.secondary}`}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
