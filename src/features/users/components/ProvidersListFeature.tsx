import { useState } from "react";
import Loader from "../../../components/Loader/Loader";
import ProviderDetails from "../../../components/ProviderDetails/ProviderDetails";
import Pagination from "../../../components/Pagination/Pagination";
import ProvidersTable from "./ProvidersTable";
import { IconAlertCircle } from "@tabler/icons-react";
import { useUsers, useDeleteUser } from "../hooks/useUsers";
import { notifications } from "../../../utils/notifications";
import type { User } from "../../../types/user.types";
import type { ProviderFilters } from "../hooks/useProviderFilters";
import styles from "../../../pages/Providers/ProvidersPage.module.css";

interface ProvidersListFeatureProps {
  filters: ProviderFilters;
  setFilter: (key: keyof ProviderFilters, value: any) => void;
}

export default function ProvidersListFeature({
  filters,
  setFilter,
}: ProvidersListFeatureProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data, isLoading, error } = useUsers({
    search: filters.search,
    account_type: "PROVIDER",
    role: (filters.role as any) || undefined,
    verification_status: (filters.status as any) || undefined,
    ordering: filters.ordering,
    page: filters.page,
    page_size: filters.pageSize,
  });

  const deleteUser = useDeleteUser();

  const handleDelete = (user: User) => {
    if (
      confirm(
        `Are you sure you want to delete ${user.first_name} ${user.last_name}?`,
      )
    ) {
      deleteUser.mutate(user.id, {
        onSuccess: () =>
          notifications.show({
            title: "Provider deleted",
            color: "green",
            message: "Provider has been deleted",
          }),
        onError: () =>
          notifications.show({
            title: "Error",
            color: "red",
            message: "Could not delete provider",
          }),
      });
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className={styles.errorContainer}>
        <IconAlertCircle size={32} /> <span>Error loading providers</span>
      </div>
    );

  const providers = data?.results || [];

  return (
    <>
      <ProvidersTable
        providers={providers}
        onView={setSelectedUser}
        onDelete={handleDelete}
      />

      {data && data.count > 0 && (
        <Pagination
          currentPage={filters.page}
          totalPages={Math.ceil(data.count / filters.pageSize)}
          totalCount={data.count}
          pageSize={filters.pageSize}
          onPageChange={(page) => setFilter("page", page)}
          onPageSizeChange={(size) => setFilter("pageSize", size)}
          itemName="providers"
        />
      )}

      <ProviderDetails
        provider={selectedUser}
        onClose={() => setSelectedUser(null)}
        showActions={false}
      />
    </>
  );
}
