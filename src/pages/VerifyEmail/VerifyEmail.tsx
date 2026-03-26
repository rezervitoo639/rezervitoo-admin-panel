import { useNavigate } from "react-router-dom";
import styles from "./VerifyEmail.module.css";

const VerifyEmail = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <svg className={styles.successIcon} viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"
            />
          </svg>
        </div>

        <h1 className={styles.title}>Check Your Email</h1>

        <p className={styles.message}>
          We sent a <strong>6-digit verification code</strong> to your email
          address. Enter it in the app to verify your account.
        </p>

        <p className={styles.message}>
          The code expires in <strong>10 minutes</strong>. If you didn't receive
          it, request a new code from the app.
        </p>

        <div className={styles.actions}>
          <button onClick={() => navigate("/login")} className={styles.button}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
