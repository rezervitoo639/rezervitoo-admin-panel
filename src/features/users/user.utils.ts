import type { User, VerificationStatus } from "../../types/user.types";

export function formatUserName(user: User): string {
  return `${user.first_name} ${user.last_name}`.trim() || user.email;
}

export function getVerificationStatusColor(status: VerificationStatus): string {
  const colors: Record<VerificationStatus, string> = {
    VERIFIED: "success",
    PENDING: "warning",
    REJECTED: "danger",
    UNVERIFIED: "info",
  };
  return colors[status];
}

export function isProviderVerified(user: User): boolean {
  return (
    user.account_type === "PROVIDER" && user.verification_status === "VERIFIED"
  );
}
