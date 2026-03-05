import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../hooks/useSidebar";
import { useAuth } from "../../hooks/useAuth";
import { useNotifications } from "../../features/notifications/hooks/useNotifications";
import { useLanguageFromUrl } from "../LanguageRedirect/index";
import ToastNotification from "../ToastNotification/ToastNotification";
import {
  IconLayoutDashboard,
  IconUsers,
  IconBuildingStore,
  IconUserCheck,
  IconCalendar,
  IconHome,
  IconDatabase,
  IconFlag,
  IconStarFilled,
  IconBell,
  IconSettings,
  IconLogout,
  IconX,
} from "@tabler/icons-react";
import styles from "./Layout.module.css";

export default function Layout() {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLang = useLanguageFromUrl();

  // Set document direction and language based on current language
  useEffect(() => {
    const isRTL = currentLang === "ar";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = currentLang;

    // Update i18n language if different from URL
    if (i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang);
    }
  }, [currentLang, i18n]);

  // Fetch ALL unread notifications (not filtered by type)
  // This counts listings, bookings, users, reports, reviews, etc.
  const { data: notificationsData } = useNotifications("all", "unread");
  // Use count from API response (total count) instead of results.length (current page only)
  const unreadCount = notificationsData?.count || 0;

  const handleLogout = () => {
    logout(); // Use auth context logout which properly clears tokens
    navigate(`/${currentLang}/login`, { replace: true });
  };

  const handleNotificationToastClick = () => {
    navigate(`/${currentLang}/notifications`);
  };

  const navItems = [
    {
      path: `/${currentLang}/dashboard`,
      icon: <IconLayoutDashboard size={20} />,
      label: t("nav.dashboard"),
    },
    {
      path: `/${currentLang}/users`,
      icon: <IconUsers size={20} />,
      label: t("nav.users"),
    },
    {
      path: `/${currentLang}/providers`,
      icon: <IconBuildingStore size={20} />,
      label: t("nav.providers"),
    },
    {
      path: `/${currentLang}/validation-queue`,
      icon: <IconUserCheck size={20} />,
      label: t("nav.validationQueue"),
    },
    {
      path: `/${currentLang}/bookings`,
      icon: <IconCalendar size={20} />,
      label: t("nav.bookings"),
    },
    {
      path: `/${currentLang}/listings`,
      icon: <IconHome size={20} />,
      label: t("nav.listings"),
    },
    {
      path: `/${currentLang}/resources`,
      icon: <IconDatabase size={20} />,
      label: t("nav.resources"),
    },
    {
      path: `/${currentLang}/reports`,
      icon: <IconFlag size={20} />,
      label: t("nav.reports"),
    },
    {
      path: `/${currentLang}/reviews`,
      icon: <IconStarFilled size={20} />,
      label: t("nav.reviews"),
    },
    {
      path: `/${currentLang}/notifications`,
      icon: <IconBell size={20} />,
      label: t("nav.notifications"),
    },
  ];

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${
          sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <div className={styles.sidebarHeader}>
          <div
            className={styles.logoContainer}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            role="button"
            tabIndex={0}
            aria-label="Toggle sidebar"
          >
            <img
              src="/src/assets/logo/logo.png"
              alt="Rezervitoo"
              className={styles.logoImage}
            />
            {sidebarOpen && <span className={styles.logoText}>Rezervitoo</span>}
          </div>
          {sidebarOpen && (
            <button
              className={styles.toggleBtn}
              onClick={() => setSidebarOpen(false)}
              aria-label="Collapse sidebar"
            >
              <IconX size={20} />
            </button>
          )}
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
              }
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className={styles.navIcon}>
                {item.icon}
                {/* Show small badge when sidebar is collapsed */}
                {item.path === "/notifications" &&
                  unreadCount > 0 &&
                  !sidebarOpen && (
                    <span className={styles.badge}>{unreadCount}</span>
                  )}
              </span>
              {sidebarOpen && (
                <span className={styles.navLabel}>
                  {item.label}
                  {/* Show large badge when sidebar is expanded */}
                  {item.path === "/notifications" && unreadCount > 0 && (
                    <span className={styles.badgeLarge}>{unreadCount}</span>
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <NavLink
            to={`/${currentLang}/settings`}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
            title={!sidebarOpen ? t("nav.settings") : undefined}
          >
            <span className={styles.navIcon}>
              <IconSettings size={20} />
            </span>
            {sidebarOpen && (
              <span className={styles.navLabel}>{t("nav.settings")}</span>
            )}
          </NavLink>
          <button
            className={styles.logoutBtn}
            onClick={handleLogout}
            title={!sidebarOpen ? t("nav.logout") : undefined}
          >
            <span className={styles.navIcon}>
              <IconLogout size={20} />
            </span>
            {sidebarOpen && (
              <span className={styles.navLabel}>{t("nav.logout")}</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`${styles.main} ${
          sidebarOpen ? styles.mainShifted : styles.mainExpanded
        }`}
      >
        <Outlet />
      </main>

      {/* Toast Notifications */}
      <ToastNotification onNotificationClick={handleNotificationToastClick} />
    </div>
  );
}
