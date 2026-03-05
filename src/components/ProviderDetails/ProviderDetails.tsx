import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IconUser,
  IconFileText,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconHome,
  IconFlag,
  IconBan,
  IconMessageCircle,
  IconStarFilled,
  IconChevronDown,
  IconChevronUp,
  IconPhone,
  IconMail,
  IconCalendar,
  IconStar,
  IconReceipt,
  IconPhoto,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import DetailModal from "../DetailModal/DetailModal";
import ListingDetails from "../ListingDetails/ListingDetails.tsx";
import ReviewModal from "../ReviewModal/ReviewModal.tsx";
import ReportModal from "../ReportModal/ReportModal.tsx";
import ListingCard from "../ListingCard/ListingCard.tsx";
import ReviewCard from "../ReviewCard/ReviewCard.tsx";
import ReportCard from "../ReportCard/ReportCard.tsx";
import RoleBadge from "../RoleBadge/RoleBadge.tsx";
import StatusBadge from "../StatusBadge/StatusBadge.tsx";
import ImageViewer from "../ImageViewer/ImageViewer.tsx";
import { notifications } from "../../utils/notifications";
import {
  useVerifyUser,
  useRejectUser,
} from "../../features/users/hooks/useUsers";
import { useListings } from "../../features/listings/hooks/useListings";
import { reportsApi, reviewsApi } from "../../api/support.api";
import { usersApi } from "../../api/users.api";
import type { User } from "../../types/user.types";
import type { Listing } from "../../types/listing.types";
import type { Review, Report } from "../../types/support.types";
import styles from "./ProviderDetails.module.css";

interface ProviderDetailsProps {
  provider: User | null;
  onClose: () => void;
  showActions?: boolean;
  elevatedZIndex?: boolean;
  hideOverlay?: boolean;
}

export default function ProviderDetails({
  provider,
  onClose,
  showActions = false,
  elevatedZIndex = false,
  hideOverlay = false,
}: ProviderDetailsProps) {
  const { t } = useTranslation();
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showDocs, setShowDocs] = useState(false);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const verifyUser = useVerifyUser();
  const rejectUser = useRejectUser();

  // Fetch full provider data
  const { data: fullProviderData } = useQuery({
    queryKey: ["user", provider?.id],
    queryFn: () => usersApi.getById(provider!.id),
    enabled: !!provider?.id,
  });

  // Use fetched full data or fallback to prop
  const displayProvider = fullProviderData || provider;

  const handleSetPending = () => {
    if (!provider) return;
    if (
      window.confirm(
        t("providerDetails.confirmStatusChange", {
          name: `${provider.first_name} ${provider.last_name}`,
        }),
      )
    ) {
      // We'll use the same API but with PENDING status
      fetch(`/api/v1/users/${provider.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ verification_status: "PENDING" }),
      })
        .then((res) => {
          if (res.ok) {
            notifications.show({
              title: t("providerDetails.statusUpdated"),
              message: t("providerDetails.statusUpdatedMessage", {
                name: `${provider.first_name} ${provider.last_name}`,
              }),
              color: "blue",
            });
            onClose();
          } else {
            throw new Error("Failed to update status");
          }
        })
        .catch(() => {
          notifications.show({
            title: t("common.error"),
            message: t("providerDetails.errorStatus"),
            color: "red",
          });
        });
    }
  };

  const handleDisableAccount = () => {
    if (!provider) return;
    if (
      window.confirm(
        t("providerDetails.confirmDisable", {
          name: `${provider.first_name} ${provider.last_name}`,
        }),
      )
    ) {
      fetch(`/api/v1/users/${provider.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ is_active: false }),
      })
        .then((res) => {
          if (res.ok) {
            notifications.show({
              title: t("providerDetails.accountDisabled"),
              message: t("providerDetails.accountDisabledMessage", {
                name: `${provider.first_name} ${provider.last_name}`,
              }),
              color: "orange",
            });
            onClose();
          } else {
            throw new Error("Failed to disable account");
          }
        })
        .catch(() => {
          notifications.show({
            title: t("common.error"),
            message: t("providerDetails.errorDisable"),
            color: "red",
          });
        });
    }
  };

  // Fetch provider's listings
  const { data: listingsData } = useListings({
    owner: provider?.id,
  });

  const { data: reportsData } = useQuery({
    queryKey: ["reports", { reported: provider?.id }],
    queryFn: () => reportsApi.list({ reported: provider!.id }),
    enabled: !!provider,
  });

  const { data: reviewsByProviderData } = useQuery({
    queryKey: ["reviews", { reviewer: provider?.id }],
    queryFn: () =>
      reviewsApi.list({
        reviewer: provider!.id,
        review_type: "PROVIDER_TO_USER",
      }),
    enabled: !!provider,
  });

  const providerListings = listingsData?.results || [];

  if (!provider) return null;
  if (!displayProvider) return null;

  // Get display name based on provider role
  const getProviderName = () => {
    switch (displayProvider.role) {
      case "HOTEL":
        return (
          displayProvider.hotel_name ||
          `${displayProvider.first_name} ${displayProvider.last_name}`
        );
      case "HOSTEL":
        return (
          displayProvider.hostel_name ||
          `${displayProvider.first_name} ${displayProvider.last_name}`
        );
      case "AGENCY":
        return (
          displayProvider.agency_name ||
          `${displayProvider.first_name} ${displayProvider.last_name}`
        );
      case "HOST":
      default:
        return `${displayProvider.first_name} ${displayProvider.last_name}`;
    }
  };

  const handleVerify = () => {
    verifyUser.mutate(displayProvider.id, {
      onSuccess: () => {
        notifications.show({
          title: t("providerDetails.verifiedTitle"),
          message: t("providerDetails.verifiedMessage", {
            name: `${displayProvider.first_name} ${displayProvider.last_name}`,
          }),
          color: "green",
        });
        onClose();
      },
      onError: () => {
        notifications.show({
          title: t("providerDetails.errorTitle"),
          message: t("providerDetails.verifyError"),
          color: "red",
        });
      },
    });
  };

  const handleReject = () => {
    if (
      confirm(
        t("providerDetails.rejectConfirm", {
          name: `${displayProvider.first_name} ${displayProvider.last_name}`,
        }),
      )
    ) {
      rejectUser.mutate(provider.id, {
        onSuccess: () => {
          notifications.show({
            title: t("providerDetails.rejectedTitle"),
            message: t("providerDetails.rejectedMessage", {
              name: `${provider.first_name} ${provider.last_name}`,
            }),
            color: "orange",
          });
          onClose();
        },
        onError: () => {
          notifications.show({
            title: t("providerDetails.errorTitle"),
            message: t("providerDetails.rejectError"),
            color: "red",
          });
        },
      });
    }
  };

  const isPending = displayProvider.verification_status === "PENDING";
  const providerName = getProviderName();

  return (
    <>
      <DetailModal
        isOpen={!!provider}
        onClose={onClose}
        title={t("providerDetails.title")}
        elevatedZIndex={elevatedZIndex}
        hideOverlay={hideOverlay}
      >
        <div className={styles.container}>
          {/* Provider Info Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <IconUser size={20} />
              <h3>{t("providerDetails.providerInfo")}</h3>
            </div>
            <div className={styles.providerHeader}>
              <div className={styles.avatar}>
                {displayProvider.pfp ? (
                  <img
                    src={displayProvider.pfp}
                    alt={t("common.profile")}
                    className={styles.avatarImage}
                  />
                ) : (
                  <>
                    {displayProvider.first_name[0]}
                    {displayProvider.last_name[0]}
                  </>
                )}
              </div>
              <div className={styles.providerInfo}>
                <h2>{providerName}</h2>
                <p className={styles.email}>{displayProvider.email}</p>
                <div className={styles.badges}>
                  <RoleBadge
                    role={displayProvider.role || "HOST"}
                    size="small"
                  />
                  <StatusBadge status={displayProvider.verification_status} />
                </div>
              </div>
            </div>

            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <IconUser size={18} className={styles.detailIcon} />
                <div>
                  <span className={styles.label}>
                    {t("providerDetails.firstName")}:
                  </span>
                  <span className={styles.value}>
                    {displayProvider.first_name}
                  </span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <IconUser size={18} className={styles.detailIcon} />
                <div>
                  <span className={styles.label}>
                    {t("providerDetails.lastName")}:
                  </span>
                  <span className={styles.value}>
                    {displayProvider.last_name}
                  </span>
                </div>
              </div>
              {displayProvider.role === "HOST" && displayProvider.host_type && (
                <div className={styles.detailItem}>
                  <IconHome size={18} className={styles.detailIcon} />
                  <div>
                    <span className={styles.label}>
                      {t("providerDetails.hostType")}:
                    </span>
                    <span className={styles.value}>
                      {displayProvider.host_type === "OWNER"
                        ? t("providerDetails.owner")
                        : t("providerDetails.agent")}
                    </span>
                  </div>
                </div>
              )}
              <div className={styles.detailItem}>
                <IconPhone size={18} className={styles.detailIcon} />
                <div>
                  <span className={styles.label}>
                    {t("providerDetails.phone")}:
                  </span>
                  <span className={styles.value}>
                    {displayProvider.phone || t("common.na")}
                  </span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <IconMail size={18} className={styles.detailIcon} />
                <div>
                  <span className={styles.label}>
                    {t("providerDetails.email")}:
                  </span>
                  <span className={styles.value}>{displayProvider.email}</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <IconCalendar size={18} className={styles.detailIcon} />
                <div>
                  <span className={styles.label}>
                    {t("providerDetails.joined")}:
                  </span>
                  <span className={styles.value}>
                    {new Date(displayProvider.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <IconCalendar size={18} className={styles.detailIcon} />
                <div>
                  <span className={styles.label}>
                    {t("providerDetails.lastLogin")}:
                  </span>
                  <span className={styles.value}>
                    {displayProvider.last_login
                      ? new Date(
                          displayProvider.last_login,
                        ).toLocaleDateString()
                      : t("providerDetails.never")}
                  </span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <IconStar size={18} className={styles.detailIcon} />
                <div>
                  <span className={styles.label}>
                    {t("providerDetails.averageRating")}:
                  </span>
                  <span className={styles.value}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <IconStarFilled
                        size={16}
                        style={{ color: "#fbbf24", marginTop: "0.125rem" }}
                      />
                      <span>
                        {displayProvider.rating && displayProvider.rating > 0
                          ? displayProvider.rating.toFixed(1)
                          : t("common.na")}
                      </span>
                    </span>
                  </span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <IconReceipt size={18} className={styles.detailIcon} />
                <div>
                  <span className={styles.label}>
                    {t("providerDetails.totalBookings")}:
                  </span>
                  <span className={styles.value}>
                    {providerListings.reduce(
                      (sum, listing) => sum + (listing.bookings_count || 0),
                      0,
                    )}
                  </span>
                </div>
              </div>
              {displayProvider.role === "HOTEL" &&
                displayProvider.hotel_stars && (
                  <div className={styles.detailItem}>
                    <IconStarFilled size={18} className={styles.detailIcon} />
                    <div>
                      <span className={styles.label}>
                        {t("providerDetails.hotelStars")}:
                      </span>
                      <div className={styles.starRating}>
                        {Array.from({
                          length: displayProvider.hotel_stars,
                        }).map((_, i) => (
                          <IconStarFilled
                            key={i}
                            size={16}
                            style={{ color: "#fbbf24" }}
                          />
                        ))}
                        <span className={styles.starCount}>
                          {t("providerDetails.starHotel", {
                            count: displayProvider.hotel_stars,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Documents Section */}
          <div className={styles.section}>
            <div
              className={styles.docSectionHeader}
              onClick={() => setShowDocs(!showDocs)}
            >
              <div className={styles.docsHeaderLeft}>
                <IconFileText size={20} />
                <h3>{t("providerDetails.legalDocuments")}</h3>
              </div>
              {showDocs ? (
                <IconChevronUp size={20} />
              ) : (
                <IconChevronDown size={20} />
              )}
            </div>

            {showDocs && (
              <div className={styles.documentsContainer}>
                {displayProvider.national_id ||
                displayProvider.national_id_recto ||
                displayProvider.national_id_verso ||
                displayProvider.nrc ||
                displayProvider.nif ||
                displayProvider.nrc_image ||
                displayProvider.nif_image ? (
                  <div className={styles.documentsInfo}>
                    <div className={styles.documentsList}>
                      {displayProvider.role === "HOST" ? (
                        <>
                          {displayProvider.national_id && (
                            <div className={styles.documentItem}>
                              <span className={styles.documentLabel}>
                                {t("providerDetails.nationalIdNumber")}
                              </span>
                              <span className={styles.documentValue}>
                                {displayProvider.national_id}
                              </span>
                            </div>
                          )}
                          <div className={styles.documentImagesRow}>
                            {displayProvider.national_id_recto && (
                              <div className={styles.documentImageItem}>
                                <span className={styles.imageLabel}>
                                  {t("providerDetails.nationalIdRecto")}
                                </span>
                                <div
                                  className={styles.imageThumbnailContainer}
                                  onClick={() =>
                                    setViewingImage(
                                      displayProvider.national_id_recto!,
                                    )
                                  }
                                >
                                  <img
                                    src={displayProvider.national_id_recto}
                                    alt="National ID Recto"
                                    className={styles.imageThumbnail}
                                  />
                                  <div className={styles.imageOverlay}>
                                    <IconPhoto size={24} />
                                    <span>
                                      {t("providerDetails.clickToView")}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                            {displayProvider.national_id_verso && (
                              <div className={styles.documentImageItem}>
                                <span className={styles.imageLabel}>
                                  {t("providerDetails.nationalIdVerso")}
                                </span>
                                <div
                                  className={styles.imageThumbnailContainer}
                                  onClick={() =>
                                    setViewingImage(
                                      displayProvider.national_id_verso!,
                                    )
                                  }
                                >
                                  <img
                                    src={displayProvider.national_id_verso}
                                    alt="National ID Verso"
                                    className={styles.imageThumbnail}
                                  />
                                  <div className={styles.imageOverlay}>
                                    <IconPhoto size={24} />
                                    <span>
                                      {t("providerDetails.clickToView")}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={styles.documentNumbersRow}>
                            {displayProvider.nrc && (
                              <div className={styles.documentItem}>
                                <span className={styles.documentLabel}>
                                  {t("providerDetails.nrcNumber")}
                                </span>
                                <span className={styles.documentValue}>
                                  {displayProvider.nrc}
                                </span>
                              </div>
                            )}
                            {displayProvider.nif && (
                              <div className={styles.documentItem}>
                                <span className={styles.documentLabel}>
                                  {t("providerDetails.nifNumber")}
                                </span>
                                <span className={styles.documentValue}>
                                  {displayProvider.nif}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className={styles.documentImagesRow}>
                            {displayProvider.nrc_image && (
                              <div className={styles.documentImageItem}>
                                <span className={styles.imageLabel}>
                                  {t("providerDetails.nrcDocument")}
                                </span>
                                <div
                                  className={styles.imageThumbnailContainer}
                                  onClick={() =>
                                    setViewingImage(displayProvider.nrc_image!)
                                  }
                                >
                                  <img
                                    src={displayProvider.nrc_image}
                                    alt="NRC Document"
                                    className={styles.imageThumbnail}
                                  />
                                  <div className={styles.imageOverlay}>
                                    <IconPhoto size={24} />
                                    <span>
                                      {t("providerDetails.clickToView")}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                            {displayProvider.nif_image && (
                              <div className={styles.documentImageItem}>
                                <span className={styles.imageLabel}>
                                  {t("providerDetails.nifDocument")}
                                </span>
                                <div
                                  className={styles.imageThumbnailContainer}
                                  onClick={() =>
                                    setViewingImage(displayProvider.nif_image!)
                                  }
                                >
                                  <img
                                    src={displayProvider.nif_image}
                                    alt="NIF Document"
                                    className={styles.imageThumbnail}
                                  />
                                  <div className={styles.imageOverlay}>
                                    <IconPhoto size={24} />
                                    <span>
                                      {t("providerDetails.clickToView")}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={styles.noData}>
                    {t("providerDetails.noDocuments")}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Listings Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <IconHome size={20} />
              <h3>
                {t("providerDetails.listings")} ({providerListings.length})
              </h3>
            </div>
            {providerListings.length === 0 ? (
              <p className={styles.noListings}>
                {t("providerDetails.noListings")}
              </p>
            ) : (
              <div className={styles.listingsGrid}>
                {providerListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onClick={() => setSelectedListing(listing)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Reviews by Provider Section */}
          {reviewsByProviderData &&
            reviewsByProviderData.results.length > 0 && (
              <>
                <div className={styles.divider}></div>
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <IconMessageCircle size={20} />
                    <h3>
                      {t("providerDetails.reviewsByProvider")} (
                      {reviewsByProviderData.count})
                    </h3>
                  </div>
                  <div className={styles.listingsGrid}>
                    {reviewsByProviderData.results.map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        onClick={() => setSelectedReview(review)}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

          {/* Reports Section */}
          {reportsData && reportsData.results.length > 0 && (
            <>
              <div className={styles.divider}></div>
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <IconFlag size={20} />
                  <h3>
                    {t("providerDetails.reportsAgainstProvider")} (
                    {reportsData.count})
                  </h3>
                </div>
                <div className={styles.listingsGrid}>
                  {reportsData.results.map((report) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onClick={() => setSelectedReport(report)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          {showActions && (
            <div className={styles.actions}>
              {isPending ? (
                <>
                  <button
                    className={styles.rejectButton}
                    onClick={handleReject}
                    disabled={rejectUser.isPending}
                  >
                    <IconX size={18} />
                    {t("providerDetails.rejectProvider")}
                  </button>
                  <button
                    className={styles.verifyButton}
                    onClick={handleVerify}
                    disabled={verifyUser.isPending}
                  >
                    <IconCheck size={18} />
                    {t("providerDetails.verifyProvider")}
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={styles.secondaryButton}
                    onClick={handleSetPending}
                  >
                    <IconAlertCircle size={18} />
                    {t("providerDetails.setToPending")}
                  </button>
                  <button
                    className={styles.dangerButton}
                    onClick={handleDisableAccount}
                    disabled={!displayProvider.is_active}
                  >
                    <IconBan size={18} />
                    {displayProvider.is_active
                      ? t("providerDetails.banProvider")
                      : t("providerDetails.accountDisabled")}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </DetailModal>
      {selectedListing && (
        <ListingDetails
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          showActions={false}
        />
      )}

      {/* Review Overlay */}
      <ReviewModal
        review={selectedReview}
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        onDelete={() => {}}
      />

      {/* Report Overlay */}
      <ReportModal
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        onStatusChange={() => {}}
      />

      {/* Document Image Viewer */}
      <ImageViewer
        images={viewingImage ? [viewingImage] : []}
        initialIndex={0}
        isOpen={!!viewingImage}
        onClose={() => setViewingImage(null)}
      />
    </>
  );
}
