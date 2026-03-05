import { AuthProvider } from "./hooks/useAuth.tsx";
import { ThemeProvider } from "./hooks/useTheme.tsx";
import { SidebarProvider } from "./hooks/useSidebar.tsx";
import { LiveUpdateProvider } from "./providers/LiveUpdateProvider.tsx";
import AppRoutes from "./routes/AppRoutes.tsx";
import "./styles/globals.css";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LiveUpdateProvider>
          <SidebarProvider>
            <AppRoutes />
          </SidebarProvider>
        </LiveUpdateProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
