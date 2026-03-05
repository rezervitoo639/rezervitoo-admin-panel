import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.tsx";
import { useLanguageFromUrl } from "../components/LanguageRedirect/index.tsx";
import Layout from "../components/Layout/Layout.tsx";
import Loader from "../components/Loader/Loader.tsx";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const currentLang = useLanguageFromUrl();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/${currentLang}/login`} replace />;
  }

  // Check if user is admin
  if (user && user.account_type !== "ADMIN") {
    // Log out non-admin users and redirect to login
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return <Navigate to={`/${currentLang}/login`} replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export function PublicRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const currentLang = useLanguageFromUrl();

  if (isLoading) {
    return <Loader />;
  }

  // Only redirect if:
  // 1. We have a valid token (isAuthenticated)
  // 2. We have successfully fetched user data
  // 3. User is an admin
  // 4. We're not already navigating to or on the dashboard
  if (
    isAuthenticated &&
    user &&
    user.account_type === "ADMIN" &&
    !location.pathname.includes("/dashboard")
  ) {
    return <Navigate to={`/${currentLang}/dashboard`} replace />;
  }

  return <Outlet />;
}
