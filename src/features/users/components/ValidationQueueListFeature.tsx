import { useState } from "react";
import Loader from "../../../components/Loader/Loader";
import ProviderDetails from "../../../components/ProviderDetails/ProviderDetails";
import ValidationQueueTable from "./ValidationQueueTable";
import { IconAlertCircle } from "@tabler/icons-react";
import { useUsers, useDeleteUser } from "../hooks/useUsers";
import { notifications } from "../../../utils/notifications";
import type { User } from "../../../types/user.types";
import type { ValidationFilters } from "../hooks/useValidationFilters";
import styles from "../../../pages/ValidationQueue/ValidationQueuePage.module.css";

interface ValidationQueueListFeatureProps {
  filters: ValidationFilters;
}

export default function ValidationQueueListFeature({
  filters,
}: ValidationQueueListFeatureProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data, isLoading, error } = useUsers({
    search: filters.search,
    account_type: "PROVIDER",
    role: (filters.role as any) || undefined,
    verification_status: undefined, // Will manually filter for PENDING or UNVERIFIED
  });

  const deleteUser = useDeleteUser();

  // Filter to show all EXCEPT VERIFIED
  const pendingUsers =
    data?.results.filter((user) => user.verification_status !== "VERIFIED") ||
    [];

  const handleDelete = (user: User) => {
    if (
      confirm(
        `Are you sure you want to delete ${user.first_name} ${user.last_name}?`,
      )
    ) {
      deleteUser.mutate(user.id, {
        onSuccess: () =>
          notifications.show({
            title: "User deleted",
            color: "green",
            message: "User has been deleted",
          }),
        onError: () =>
          notifications.show({
            title: "Error",
            color: "red",
            message: "Could not delete user",
          }),
      });
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className={styles.errorContainer}>
        <IconAlertCircle size={32} />{" "}
        <span>Error loading validation queue</span>
      </div>
    );

  return (
    <>
      <ValidationQueueTable
        users={pendingUsers}
        onView={setSelectedUser}
        onDelete={handleDelete}
      />

      <ProviderDetails
        provider={selectedUser}
        onClose={() => setSelectedUser(null)}
        showActions={true}
      />
    </>
  );
}
