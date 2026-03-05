import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IconHome,
  IconMapPin,
  IconCheck,
  IconX,
  IconStar,
  IconBed,
  IconBath,
  IconCalendar,
  IconRoute,
  IconHeart,
  IconMessageCircle,
  IconChevronDown,
  IconChevronUp,
  IconBan,
} from "@tabler/icons-react";
import DetailModal from "../DetailModal/DetailModal";
import RoleBadge from "../RoleBadge/RoleBadge";
import StatusBadge from "../StatusBadge/StatusBadge";
import ProviderDetails from "../ProviderDetails/ProviderDetails.tsx";
import ReviewModal from "../ReviewModal/ReviewModal.tsx";
import ProfileSection from "../ProfileSection/ProfileSection.tsx";
import ReviewCard from "../ReviewCard/ReviewCard.tsx";
import { AvailabilityCalendar } from "../AvailabilityCalendar/AvailabilityCalendar";
import ImageViewer from "../ImageViewer/ImageViewer";
import { notifications } from "../../utils/notifications";
import { usersApi } from "../../api/users.api";
import { listingsApi } from "../../api/listings.api";
import { reviewsApi } from "../../api/support.api";
import apiClient from "../../api/index";
import {
  useApproveListing,
  useRejectListing,
} from "../../features/listings/hooks/useListings";
import type {
  Listing,
  PropertyListing,
  HotelRoomListing,
  HostelBedListing,
  TravelPackageListing,
} from "../../types/listing.types";
import type { User } from "../../types/user.types";
import type { Review } from "../../types/support.types";
import styles from "./ListingDetails.module.css";

interface ListingDetailsProps {
  listing: Listing | null;
  onClose: () => void;
  showActions?: boolean;
  elevatedZIndex?: boolean;
  hideOverlay?: boolean;
}

export default function ListingDetails({
  listing,
  onClose,
  showActions = false,
  elevatedZIndex = false,
  hideOverlay = false,
}: ListingDetailsProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const approveListing = useApproveListing();
  const rejectListing = useRejectListing();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<User | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);

  // Collapsible state for Travel Packages
  const [showSchedules, setShowSchedules] = useState(true);
  const [showItinerary, setShowItinerary] = useState(true);

  // Deactivate listing mutation
  const deactivateListing = useMutation({
    mutationFn: async (listingId: number) => {
      const response = await apiClient.patch<Listing>(
        `/listings/${listingId}/`,
        {
          is_active: false,
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listing", listing?.id] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });

  // Fetch full listing data
  const { data: fullListingData } = useQuery({
    queryKey: ["listing", listing?.id],
    queryFn: () => listingsApi.getById(listing!.id),
    enabled: !!listing?.id,
  });

  // Use fetched full data or fallback to prop
  const displayListing = fullListingData || listing;

  // Fetch provider details
  const { data: provider } = useQuery({
    queryKey: ["user", listing?.owner],
    queryFn: () => usersApi.getById(listing!.owner),
    enabled: !!listing?.owner,
  });

  // Fetch reviews for this listing
  const { data: reviewsData } = useQuery({
    queryKey: ["reviews", { listing: listing?.id }],
    queryFn: () =>
      reviewsApi.list({
        listing: listing!.id,
        review_type: "USER_TO_LISTING",
      }),
    enabled: !!listing,
  });

  if (!listing) return null;
  if (!displayListing) return null;

  const handleApprove = () => {
    approveListing.mutate(
      { id: displayListing.id, status: "APPROVED" },
      {
        onSuccess: () => {
          notifications.show({
            title: t("listingDetails.approveSuccess"),
            message: t("listingDetails.approveMessage", {
              title: displayListing.title,
            }),
            color: "green",
          });
          onClose();
        },
        onError: () => {
          notifications.show({
            title: t("common.error"),
            message: t("listingDetails.approveError"),
            color: "red",
          });
        },
      },
    );
  };

  const handleReject = () => {
    if (
      confirm(
        t("listingDetails.rejectConfirm", { title: displayListing.title }),
      )
    ) {
      rejectListing.mutate(
        { id: displayListing.id, status: "REJECTED" },
        {
          onSuccess: () => {
            notifications.show({
              title: t("listingDetails.rejectSuccess"),
              message: t("listingDetails.rejectMessage", {
                title: displayListing.title,
              }),
              color: "orange",
            });
            onClose();
          },
          onError: () => {
            notifications.show({
              title: t("common.error"),
              message: t("listingDetails.rejectError"),
              color: "red",
            });
          },
        },
      );
    }
  };

  const handleDeactivate = () => {
    if (confirm(t("listingDetails.confirmDeactivate"))) {
      deactivateListing.mutate(displayListing.id, {
        onSuccess: () => {
          notifications.show({
            title: t("listingDetails.listingDeactivated"),
            message: t("listingDetails.listingDeactivatedMessage", {
              title: displayListing.title,
            }),
            color: "orange",
          });
          onClose();
        },
        onError: () => {
          notifications.show({
            title: t("common.error"),
            message: t("listingDetails.deactivateError"),
            color: "red",
          });
        },
      });
    }
  };

  return (
    <>
      <DetailModal
        isOpen={!!listing}
        onClose={onClose}
        title={t("listingDetails.title")}
        elevatedZIndex={elevatedZIndex}
        hideOverlay={hideOverlay}
      >
        <div className={styles.container}>
          {/* Cover Image */}
          <div
            className={styles.coverImage}
            onClick={() => {
              setImageViewerIndex(0);
              setImageViewerOpen(true);
            }}
            style={{ cursor: "pointer" }}
          >
            <img
              src={displayListing.cover_image || "/placeholder.jpg"}
              alt={displayListing.title}
            />
            <div className={styles.coverOverlay}>
              <StatusBadge status={displayListing.approval_status} />
              {displayListing.is_featured && (
                <span className={styles.featuredBadge}>
                  <IconStar size={16} />
                  {t("listingDetails.featured")}
                </span>
              )}
            </div>
          </div>

          {/* Listing Info */}
          <div className={styles.section}>
            <div className={styles.header}>
              <div>
                <h2 className={styles.title}>{displayListing.title}</h2>
                <div className={styles.metadataContainer}>
                  <RoleBadge role={displayListing.listing_type} />
                  <div className={styles.statsContainer}>
                    <div className={styles.statItem}>
                      <IconStar size={16} className={styles.ratingStarIcon} />
                      <span>
                        {displayListing.average_rating !== undefined &&
                        displayListing.average_rating !== null
                          ? displayListing.average_rating.toFixed(1)
                          : "N/A"}
                        {(displayListing as any).review_count !== undefined &&
                          (displayListing as any).review_count > 0 && (
                            <span
                              style={{ fontSize: "0.875rem", opacity: 0.7 }}
                            >
                              {" "}
                              ({(displayListing as any).review_count})
                            </span>
                          )}
                      </span>
                    </div>
                    <div className={styles.statItem}>
                      <IconHeart size={16} className={styles.heartIcon} />
                      <span>{displayListing.wishlist_count || 0}</span>
                    </div>
                    <div className={styles.statItem}>
                      <IconCalendar size={16} className={styles.bookingsIcon} />
                      <span>{displayListing.bookings_count || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.headerRight}>
                {displayListing.listing_type !== "TRAVEL_PACKAGE" && (
                  <button
                    className={styles.calendarButton}
                    onClick={() => setShowCalendar(true)}
                    title={t("listingDetails.availability")}
                  >
                    <IconCalendar size={20} />
                    <span>{t("listingDetails.availability")}</span>
                  </button>
                )}
                <div className="entity-price">{`${displayListing.price} DA`}</div>
              </div>
            </div>

            <p className={styles.description}>{displayListing.description}</p>

            <div className={styles.detailsGrid}>
              {displayListing.listing_type !== "TRAVEL_PACKAGE" && (
                <>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>
                      {t("listingDetails.quantity")}:
                    </span>
                    <span className={styles.value}>
                      {displayListing.quantity}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>
                      {t("listingDetails.maxGuests")}:
                    </span>
                    <span className={styles.value}>
                      {displayListing.max_guests}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>
                      {t("listingDetails.minDuration")}:
                    </span>
                    <span className={styles.value}>
                      {displayListing.min_duration} {t("listingDetails.nights")}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>
                      {t("listingDetails.active")}:
                    </span>
                    <span className={styles.value}>
                      {displayListing.is_active
                        ? t("listingDetails.yes")
                        : t("listingDetails.no")}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Type-Specific Details */}
          {displayListing.listing_type === "PROPERTY" && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <IconHome size={20} />
                <h3>{t("listingDetails.propertyDetails")}</h3>
              </div>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.label}>
                    {t("listingDetails.propertyType")}:
                  </span>
                  <span className={styles.value}>
                    {(displayListing as PropertyListing).property_type}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.iconLabel}>
                    <IconBed size={18} className={styles.detailIcon} />
                    <span className={styles.label}>
                      {t("listingDetails.bedrooms")}
                    </span>
                  </div>
                  <span className={styles.value}>
                    {(displayListing as PropertyListing).bedrooms}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.iconLabel}>
                    <IconBath size={18} className={styles.detailIcon} />
                    <span className={styles.label}>
                      {t("listingDetails.bathrooms")}
                    </span>
                  </div>
                  <span className={styles.value}>
                    {(displayListing as PropertyListing).bathrooms}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>
                    {t("listingDetails.negotiable")}:
                  </span>
                  <span className={styles.value}>
                    {displayListing.negotiable
                      ? t("listingDetails.yes")
                      : t("listingDetails.no")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {displayListing.listing_type === "HOTEL_ROOM" && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <IconHome size={20} />
                <h3>{t("listingDetails.hotelRoomDetails")}</h3>
              </div>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.label}>
                    {t("listingDetails.quantity")}:
                  </span>
                  <span className={styles.value}>
                    {displayListing.quantity}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>
                    {t("listingDetails.roomCategory")}:
                  </span>
                  <span className={styles.value}>
                    {(displayListing as HotelRoomListing).room_category}
                  </span>
                </div>
                {(displayListing as HotelRoomListing).hotel_stars && (
                  <div className={styles.detailItem}>
                    <span className={styles.label}>
                      {t("listingDetails.hotelRating")}:
                    </span>
                    <div className={styles.starRating}>
                      {Array.from({
                        length:
                          (displayListing as HotelRoomListing).hotel_stars || 0,
                      }).map((_, i) => (
                        <IconStar
                          key={i}
                          size={20}
                          fill="#FFD700"
                          color="#FFD700"
                        />
                      ))}
                      <span className={styles.starCount}>
                        {t("listingDetails.starHotel", {
                          count: (displayListing as HotelRoomListing)
                            .hotel_stars,
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {displayListing.listing_type === "HOSTEL_BED" && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <IconHome size={20} />
                <h3>{t("listingDetails.hostelBedDetails")}</h3>
              </div>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.label}>
                    {t("listingDetails.quantity")}:
                  </span>
                  <span className={styles.value}>
                    {displayListing.quantity}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>
                    {t("listingDetails.roomType")}:
                  </span>
                  <span className={styles.value}>
                    {(displayListing as HostelBedListing).room_type}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>
                    {t("listingDetails.gender")}:
                  </span>
                  <span className={styles.value}>
                    {(displayListing as HostelBedListing).gender}
                  </span>
                </div>
              </div>
            </div>
          )}

          {displayListing.listing_type === "TRAVEL_PACKAGE" && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <IconRoute size={20} />
                <h3>{t("listingDetails.travelPackageDetails")}</h3>
              </div>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.label}>
                    {t("listingDetails.packageType")}:
                  </span>
                  <span className={styles.value}>
                    {(displayListing as TravelPackageListing).package_type}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.iconLabel}>
                    <IconCalendar size={18} className={styles.detailIcon} />
                    <span className={styles.label}>
                      {t("listingDetails.duration")}:
                    </span>
                  </div>
                  <span className={styles.value}>
                    {(displayListing as TravelPackageListing).duration_days}{" "}
                    {t("listingDetails.days")}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>
                    {t("listingDetails.active")}:
                  </span>
                  <span className={styles.value}>
                    {displayListing.is_active
                      ? t("listingDetails.yes")
                      : t("listingDetails.no")}
                  </span>
                </div>
              </div>

              {/* Package Schedules */}
              {(displayListing as TravelPackageListing).schedules &&
                (displayListing as TravelPackageListing).schedules!.length >
                  0 && (
                  <div className={styles.schedules}>
                    <div
                      className={styles.schedulesHeader}
                      onClick={() => setShowSchedules(!showSchedules)}
                    >
                      <h4 className={styles.schedulesSectionTitle}>
                        {t("listingDetails.availableDepartures")} (
                        {
                          (displayListing as TravelPackageListing).schedules!
                            .length
                        }
                        )
                      </h4>
                      {showSchedules ? (
                        <IconChevronUp size={20} />
                      ) : (
                        <IconChevronDown size={20} />
                      )}
                    </div>

                    {showSchedules && (
                      <div className={styles.schedulesList}>
                        {(
                          displayListing as TravelPackageListing
                        ).schedules!.map((schedule) => (
                          <div
                            key={schedule.id}
                            className={`${styles.scheduleItem} ${
                              schedule.is_fully_booked ? styles.fullyBooked : ""
                            }`}
                          >
                            <div className={styles.scheduleId}>
                              {t("listingDetails.scheduleId")}: {schedule.id}
                            </div>
                            <div className={styles.scheduleDates}>
                              <div className={styles.scheduleDate}>
                                <span className={styles.scheduleLabel}>
                                  {t("listingDetails.departure")}:
                                </span>
                                <span className={styles.scheduleValue}>
                                  {new Date(
                                    schedule.start_date,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <span className={styles.scheduleSeparator}>
                                →
                              </span>
                              <div className={styles.scheduleDate}>
                                <span className={styles.scheduleLabel}>
                                  {t("listingDetails.return")}:
                                </span>
                                <span className={styles.scheduleValue}>
                                  {new Date(
                                    schedule.end_date,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className={styles.scheduleDetailsLayout}>
                              <div className={styles.scheduleCapacity}>
                                <span className={styles.scheduleLabel}>
                                  {t("listingDetails.availability")}:
                                </span>
                                <span
                                  className={`${styles.scheduleCapacityValue} ${
                                    schedule.is_fully_booked
                                      ? styles.noSpots
                                      : ""
                                  }`}
                                >
                                  {schedule.spots_booked} /{" "}
                                  {schedule.max_capacity}{" "}
                                  {t("listingDetails.spotsBooked")}
                                  {schedule.is_fully_booked && (
                                    <span className={styles.fullyBookedBadge}>
                                      {t("listingDetails.full")}
                                    </span>
                                  )}
                                </span>
                              </div>
                              <div
                                className={`${styles.spotsAvailable} ${
                                  schedule.is_fully_booked
                                    ? styles.full
                                    : styles.available
                                }`}
                              >
                                {schedule.spots_available}{" "}
                                {t("listingDetails.spotsAvailableLeft")}
                              </div>
                            </div>
                            <div className={styles.scheduleProgressBar}>
                              <div
                                className={styles.scheduleProgress}
                                style={{
                                  width: `${
                                    (schedule.spots_booked /
                                      schedule.max_capacity) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              {/* Itinerary */}
              {(displayListing as TravelPackageListing).itinerary_items &&
                (displayListing as TravelPackageListing).itinerary_items!
                  .length > 0 && (
                  <div className={styles.itinerary}>
                    <div
                      className={styles.itineraryHeader}
                      onClick={() => setShowItinerary(!showItinerary)}
                    >
                      <h4 className={styles.itinerarySectionTitle}>
                        {t("listingDetails.itinerary")}
                      </h4>
                      {showItinerary ? (
                        <IconChevronUp size={20} />
                      ) : (
                        <IconChevronDown size={20} />
                      )}
                    </div>
                    {showItinerary && (
                      <div className={styles.itineraryList}>
                        {(
                          displayListing as TravelPackageListing
                        ).itinerary_items!.map((item) => (
                          <div key={item.id} className={styles.itineraryItem}>
                            <div className={styles.itineraryDay}>
                              {t("listingDetails.day")} {item.day}
                            </div>
                            <div className={styles.itineraryContent}>
                              <div className={styles.itineraryTitle}>
                                {item.title}
                              </div>
                              {item.description && (
                                <div className={styles.itineraryDescription}>
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
            </div>
          )}

          {/* Owner Info */}
          {provider && (
            <ProfileSection
              user={provider}
              onClick={() => setSelectedProvider(provider)}
              title={t("listingDetails.ownerInformation")}
            />
          )}

          {/* Location */}
          {displayListing.location && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <IconMapPin size={20} />
                <h3>{t("listingDetails.location")}</h3>
              </div>
              <div className={styles.locationInfo}>
                <p>
                  <strong>{t("listingDetails.address")}:</strong>{" "}
                  {displayListing.location.address || "N/A"}
                </p>
                <p>
                  <strong>{t("listingDetails.city")}:</strong>{" "}
                  {displayListing.location.city || "N/A"}
                </p>
                <p>
                  <strong>{t("listingDetails.district")}:</strong>{" "}
                  {displayListing.location.district || "N/A"}
                </p>
              </div>
            </div>
          )}

          {/* Amenities */}
          {displayListing.amenity_details &&
            displayListing.amenity_details.length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <IconHome size={20} />
                  <h3>{t("listingDetails.amenities")}</h3>
                </div>
                <div className={styles.amenitiesGrid}>
                  {displayListing.amenity_details.map((amenity) => (
                    <div key={amenity.id} className={styles.amenityItem}>
                      <IconCheck size={16} className={styles.checkIcon} />
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Restrictions */}
          {displayListing.restriction_details &&
            displayListing.restriction_details.length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <IconX size={20} />
                  <h3>{t("listingDetails.restrictions")}</h3>
                </div>
                <div className={styles.restrictionsList}>
                  {displayListing.restriction_details.map((restriction) => (
                    <div
                      key={restriction.id}
                      className={styles.restrictionItem}
                    >
                      <IconX size={16} className={styles.restrictionIcon} />
                      <span>{restriction.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Nearby Locations */}
          {displayListing.nearby_details &&
            displayListing.nearby_details.length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <IconMapPin size={20} />
                  <h3>{t("listingDetails.nearbyLocations")}</h3>
                </div>
                <div className={styles.nearbyGrid}>
                  {displayListing.nearby_details.map((nearby) => (
                    <div key={nearby.id} className={styles.nearbyItem}>
                      <span className={styles.nearbyName}>{nearby.name}</span>
                      {nearby.distance && (
                        <span className={styles.nearbyDistance}>
                          {nearby.distance} {t("listingDetails.km")}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Bed Types */}
          {displayListing.beds && displayListing.beds.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <IconHome size={20} />
                <h3>{t("listingDetails.bedConfiguration")}</h3>
              </div>
              <div className={styles.bedsGrid}>
                {displayListing.beds.map((bed, index) => (
                  <div key={index} className={styles.bedItem}>
                    <span className={styles.bedType}>
                      {bed.bed_type_details?.name || "Unknown"}
                    </span>
                    <span className={styles.bedQuantity}>
                      {t("listingDetails.quantity")}: {bed.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Images */}
          {displayListing.images && displayListing.images.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>
                  {t("listingDetails.additionalImages")} (
                  {displayListing.images.length})
                </h3>
              </div>
              <div className={styles.imagesGrid}>
                {displayListing.images.map((img, index) => (
                  <div
                    key={img.id}
                    className={styles.imageCard}
                    onClick={() => {
                      setImageViewerIndex(index + 1);
                      setImageViewerOpen(true);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <img src={img.image} alt={`Listing image ${img.id}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          {reviewsData && reviewsData.results.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <IconMessageCircle size={20} />
                <h3>
                  {t("listingDetails.reviews")} ({reviewsData.count})
                </h3>
              </div>
              <div className={styles.listingsGrid}>
                {reviewsData.results.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onClick={() => setSelectedReview(review)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {showActions && displayListing.approval_status === "PENDING" && (
            <div className={styles.actions}>
              <button
                className={styles.rejectButton}
                onClick={handleReject}
                disabled={rejectListing.isPending}
              >
                <IconX size={18} />
                {t("listingDetails.rejectListing")}
              </button>
              <button
                className={styles.approveButton}
                onClick={handleApprove}
                disabled={approveListing.isPending}
              >
                <IconCheck size={18} />
                {t("listingDetails.approveListing")}
              </button>
            </div>
          )}

          {/* Deactivate Button */}
          {displayListing.is_active && (
            <div className={styles.actions}>
              <button
                className={styles.deactivateButton}
                onClick={handleDeactivate}
                disabled={deactivateListing.isPending}
              >
                <IconBan size={18} />
                {t("listingDetails.deactivateListing")}
              </button>
            </div>
          )}
        </div>

        {/* Availability Calendar Modal */}
        {showCalendar && (
          <AvailabilityCalendar
            listingId={displayListing.id}
            unavailableDates={displayListing.unavailable_dates}
            onClose={() => setShowCalendar(false)}
          />
        )}
      </DetailModal>

      {/* Image Viewer */}
      <ImageViewer
        images={[
          displayListing.cover_image || "/placeholder.jpg",
          ...(displayListing.images?.map((img) => img.image) || []),
        ]}
        initialIndex={imageViewerIndex}
        isOpen={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
      />

      {selectedProvider && (
        <ProviderDetails
          provider={selectedProvider}
          onClose={() => setSelectedProvider(null)}
          showActions={false}
        />
      )}

      {/* Review Modal */}
      <ReviewModal
        review={selectedReview}
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        onDelete={() => {}}
      />
    </>
  );
}
