import { useState } from "react";
import UserTable from "./UserTable";
import UserDetails from "../../../components/UserDetails/UserDetails";
import Pagination from "../../../components/Pagination/Pagination";
import Loader from "../../../components/Loader/Loader";
import { IconAlertCircle } from "@tabler/icons-react";
import { useUsers, useDeleteUser } from "../hooks/useUsers";
import { notifications } from "../../../utils/notifications";
import type { User } from "../../../types/user.types";
import styles from "../../../pages/Users/UserManagementPage.module.css";

interface UsersListFeatureProps {
  search: string;
  ordering?: string;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function UsersListFeature({
  search,
  ordering,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: UsersListFeatureProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data, isLoading, error } = useUsers({
    search,
    account_type: "USER",
    ordering,
    page,
    page_size: pageSize,
  });

  const deleteUser = useDeleteUser();

  const handleDelete = (user: User) => {
    if (
      confirm(
        `Are you sure you want to delete ${user.first_name} ${user.last_name}?`
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
        <IconAlertCircle size={32} /> <span>Error loading users</span>
      </div>
    );

  const users = data?.results || [];

  return (
    <>
      <UserTable
        users={users}
        onView={setSelectedUser}
        onDelete={handleDelete}
      />

      {/* Pagination Controls */}
      {data && data.count > 0 && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(data.count / pageSize)}
          totalCount={data.count}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          itemName="users"
        />
      )}

      <UserDetails user={selectedUser} onClose={() => setSelectedUser(null)} />
    </>
  );
}
