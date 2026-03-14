import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "./ProtectedRoute.tsx";
import { LanguageRedirect } from "../components/LanguageRedirect/index.tsx";
import LoginPage from "../pages/Login/LoginPage.tsx";
import VerifyEmail from "../pages/VerifyEmail/VerifyEmail.tsx";
import ResetPasswordPage from "../pages/ResetPassword/ResetPasswordPage.tsx";
import DashboardPage from "../pages/Dashboard/DashboardPage.tsx";
import UserManagementPage from "../pages/Users/UserManagementPage.tsx";
import ProvidersPage from "../pages/Providers/ProvidersPage.tsx";
import ValidationQueuePage from "../pages/ValidationQueue/ValidationQueuePage.tsx";
import BookingsPage from "../pages/Bookings/BookingsPage.tsx";
import ListingsPage from "../pages/Listings/ListingsPage.tsx";
import ResourcesPage from "../pages/Resources/ResourcesPage.tsx";
import ReportsPage from "../pages/Reports/ReportsPage.tsx";
import ReviewsPage from "../pages/Reviews/ReviewsPage.tsx";
import SettingsPage from "../pages/Settings/SettingsPage.tsx";
import NotificationsPage from "../pages/Notifications/NotificationsPage.tsx";

export default function AppRoutes() {
  return (
    <>
      <LanguageRedirect />
      <Routes>
        {/* Language-prefixed routes */}
        <Route path="/:lang">
          {/* Public routes - redirect to dashboard if already authenticated */}
          <Route element={<PublicRoute />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="verify-email" element={<VerifyEmail />} />
            <Route path="password-reset" element={<ResetPasswordPage />} />
          </Route>

          {/* Protected routes with Layout */}
          <Route element={<ProtectedRoute />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="providers" element={<ProvidersPage />} />
            <Route path="validation-queue" element={<ValidationQueuePage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="listings" element={<ListingsPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Root redirect - will be handled by LanguageRedirect */}
        <Route path="/" element={<Navigate to="/ar/dashboard" replace />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/ar/dashboard" replace />} />
      </Routes>
    </>
  );
}
