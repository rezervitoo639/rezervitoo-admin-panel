import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { bookingsApi } from "../../api/bookings.api";
import type { Booking } from "../../types/booking.types";
import styles from "./AvailabilityCalendar.module.css";

interface UnavailableDate {
  id: number;
  start_date: string;
  end_date: string;
  reason?: string;
}

interface AvailabilityCalendarProps {
  listingId: number;
  unavailableDates?: UnavailableDate[];
  onClose: () => void;
}

export const AvailabilityCalendar = ({
  listingId,
  unavailableDates = [],
  onClose,
}: AvailabilityCalendarProps) => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Debug logging
  useEffect(() => {
    console.log("Calendar initialized:", {
      listingId,
      unavailableDatesCount: unavailableDates.length,
      unavailableDates: unavailableDates,
    });
  }, [listingId, unavailableDates]);

  useEffect(() => {
    fetchBookedDates();
  }, [listingId]);

  const fetchBookedDates = async () => {
    try {
      const bookings = await bookingsApi.getByListing(listingId);
      console.log("Fetched bookings for listing:", listingId, bookings);
      setBookedDates(bookings);
    } catch (error) {
      console.error("Error fetching booked dates:", error);
      setBookedDates([]);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const isDateInRange = (
    date: Date,
    startDate: string,
    endDate: string,
  ): boolean => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    return checkDate >= start && checkDate <= end;
  };

  const isPastDate = (day: number): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const isBlocked = (day: number): boolean => {
    const checkDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    const result = unavailableDates.some((blocked) => {
      const isInRange = isDateInRange(
        checkDate,
        blocked.start_date,
        blocked.end_date,
      );
      if (isInRange) {
        console.log("Date is blocked:", {
          day,
          checkDate: checkDate.toISOString(),
          blockedRange: `${blocked.start_date} to ${blocked.end_date}`,
          reason: blocked.reason,
        });
      }
      return isInRange;
    });
    return result;
  };

  const isBooked = (day: number): boolean => {
    const checkDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    return bookedDates.some(
      (booking) =>
        booking.status !== "CANCELLED" &&
        booking.status !== "REJECTED" &&
        booking.start_date &&
        booking.end_date &&
        isDateInRange(checkDate, booking.start_date, booking.end_date),
    );
  };

  const getBlockReason = (day: number): string | undefined => {
    const checkDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    const blocked = unavailableDates.find((b) =>
      isDateInRange(checkDate, b.start_date, b.end_date),
    );
    return blocked?.reason;
  };

  const canNavigatePrevious = (): boolean => {
    const today = new Date();
    const firstDayOfCurrentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const firstDayOfThisMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    );
    return firstDayOfCurrentMonth > firstDayOfThisMonth;
  };

  const handlePreviousMonth = () => {
    if (canNavigatePrevious()) {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
      );
    }
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const past = isPastDate(day);
      const blocked = isBlocked(day);
      const booked = isBooked(day);
      const blockReason = blocked ? getBlockReason(day) : undefined;

      let className = styles.day;
      if (past) className += ` ${styles.past}`;
      else if (blocked) className += ` ${styles.blocked}`;
      else if (booked) className += ` ${styles.booked}`;

      days.push(
        <div
          key={day}
          className={className}
          title={
            past
              ? t("calendar.pastDate")
              : blocked
                ? `${t("calendar.blocked")}: ${blockReason || t("calendar.unavailable")}`
                : booked
                  ? t("calendar.booked")
                  : t("calendar.available")
          }
        >
          <span className={styles.dayNumber}>{day}</span>
        </div>,
      );
    }

    // Get translated month names and days
    const monthNames = t("calendar.monthNames", {
      returnObjects: true,
    }) as string[];
    const daysShort = t("calendar.daysShort", {
      returnObjects: true,
    }) as string[];

    // Fallback if translation fails or returns string (sanity check)
    const displayMonth = Array.isArray(monthNames)
      ? monthNames[currentDate.getMonth()]
      : currentDate.toLocaleString("default", { month: "long" });
    const weekDays = Array.isArray(daysShort)
      ? daysShort
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <>
        <div className={styles.overlay} onClick={onClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <h2 className={styles.title}>{t("calendar.title")}</h2>
              <button className={styles.closeButton} onClick={onClose}>
                ✕
              </button>
            </div>

            <div className={styles.calendar}>
              <div className={styles.monthNavigation}>
                <button
                  className={styles.navButton}
                  onClick={handlePreviousMonth}
                  disabled={!canNavigatePrevious()}
                >
                  ‹
                </button>
                <h3 className={styles.monthYear}>
                  {displayMonth} {currentDate.getFullYear()}
                </h3>
                <button className={styles.navButton} onClick={handleNextMonth}>
                  ›
                </button>
              </div>

              <div className={styles.weekDays}>
                {weekDays.map((day) => (
                  <div key={day} className={styles.weekDay}>
                    {day}
                  </div>
                ))}
              </div>

              {loading ? (
                <div className={styles.loading}>{t("common.loading")}</div>
              ) : (
                <div className={styles.daysGrid}>{days}</div> // Changed renderCalendar() call logic here to just use the days array we built
              )}

              <div className={styles.legend}>
                <div className={styles.legendItem}>
                  <span
                    className={`${styles.legendIcon} ${styles.available}`}
                  />
                  <span>{t("calendar.available")}</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendIcon} ${styles.booked}`} />
                  <span>{t("calendar.booked")}</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendIcon} ${styles.blocked}`} />
                  <span>{t("calendar.blocked")}</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendIcon} ${styles.past}`}>
                    -
                  </span>
                  <span>{t("calendar.past")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return renderCalendar();
};
