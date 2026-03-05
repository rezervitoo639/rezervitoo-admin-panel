type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationOptions {
  title: string;
  message: string;
  color?: string;
}

const notificationStyles: Record<
  NotificationType,
  { backgroundColor: string; color: string }
> = {
  success: { backgroundColor: "#51cf66", color: "#fff" },
  error: { backgroundColor: "#ff6b6b", color: "#fff" },
  warning: { backgroundColor: "#ffd43b", color: "#000" },
  info: { backgroundColor: "#339af0", color: "#fff" },
};

export const notifications = {
  show: (options: NotificationOptions) => {
    const type: NotificationType =
      options.color === "green"
        ? "success"
        : options.color === "red"
        ? "error"
        : "info";

    const notification = document.createElement("div");
    const styles = notificationStyles[type];

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${styles.backgroundColor};
      color: ${styles.color};
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      min-width: 300px;
      animation: slideIn 0.3s ease-out;
    `;

    notification.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 0.25rem;">${options.title}</div>
      <div style="font-size: 0.9rem;">${options.message}</div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  },
};

// Add keyframes for animations
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
