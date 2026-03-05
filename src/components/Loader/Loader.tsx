import styles from "./Loader.module.css";

interface LoaderProps {
  size?: "small" | "medium" | "large";
}

export default function Loader({ size = "medium" }: LoaderProps) {
  return (
    <div
      className={`${styles.loader} ${size !== "medium" ? styles[size] : ""}`}
    >
      <div className={styles.spinner} />
    </div>
  );
}
