import { useState } from "react";
import { useTranslation } from "react-i18next";
import Loader from "../../../components/Loader/Loader";
import ReportModal from "../../../components/ReportModal/ReportModal";
import Pagination from "../../../components/Pagination/Pagination";
import ReportsTable from "./ReportsTable";
import { IconAlertCircle } from "@tabler/icons-react";
import {
  useReports,
  useUpdateReportStatus,
  useDeleteReport,
} from "../hooks/useReports";
import { notifications } from "../../../utils/notifications";
import type { Report } from "../../../types/support.types";
import type { ReportFilters } from "../hooks/useReportFilters";
import styles from "../../../pages/Reports/ReportsPage.module.css";

interface ReportsListFeatureProps {
  filters: ReportFilters;
  setFilter: (key: keyof ReportFilters, value: any) => void;
}

export default function ReportsListFeature({
  filters,
  setFilter,
}: ReportsListFeatureProps) {
  const { t } = useTranslation();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading, error } = useReports({
    status: filters.status === "all" ? undefined : filters.status,
    reportType: filters.reportType || undefined,
    search: filters.search || undefined,
    page: filters.page,
    page_size: filters.pageSize,
  });

  const updateStatusMutation = useUpdateReportStatus();
  const deleteMutation = useDeleteReport();

  const handleStatusUpdate = (
    reportId: number,
    newStatus: string,
    notes?: string,
  ) => {
    updateStatusMutation.mutate(
      { id: reportId, status: newStatus, notes: notes || "" },
      {
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "Report status updated",
            color: "green",
          });
          setShowModal(false);
        },
        onError: () => {
          notifications.show({
            title: "Error",
            message: "Failed to update report",
            color: "red",
          });
        },
      },
    );
  };

  const handleDelete = (report: Report) => {
    if (confirm("Are you sure you want to delete this report?")) {
      deleteMutation.mutate(report.id, {
        onSuccess: () => {
          notifications.show({
            title: "Deleted",
            message: "Report has been deleted",
            color: "orange",
          });
          setShowModal(false);
        },
        onError: () => {
          notifications.show({
            title: "Error",
            message: "Failed to delete report",
            color: "red",
          });
        },
      });
    }
  };

  const handleView = (report: Report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className={styles.errorContainer}>
        <IconAlertCircle size={32} /> <span>Error loading reports</span>
      </div>
    );

  const reports = data?.results || [];

  return (
    <>
      <ReportsTable
        reports={reports}
        onView={handleView}
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
          itemName={t("nav.reports")}
        />
      )}

      <ReportModal
        report={selectedReport}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onStatusChange={handleStatusUpdate}
        onDelete={(id) => {
          const report = reports.find((r) => r.id === id);
          if (report) handleDelete(report);
        }}
      />
    </>
  );
}
