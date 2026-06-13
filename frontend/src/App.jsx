import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

import DashboardPage from "./pages/DashboardPage";
import InterviewPage from "./pages/InterviewPage";
import ResumePage from "./pages/ResumePage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";

import SidebarLayout from "./components/SidebarLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={<LandingPage />}
        />
        <Route
          path="/login"
          element={<LoginPage />}
        />
        <Route
          path="/signup"
          element={<SignupPage />}
        />
        <Route
          path="/verify-otp"
          element={<VerifyOTPPage />}
        />
        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <SidebarLayout>
                <DashboardPage />
              </SidebarLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <SidebarLayout>
                <InterviewPage />
              </SidebarLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <SidebarLayout>
                <ResumePage />
              </SidebarLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <SidebarLayout>
                <HistoryPage />
              </SidebarLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SidebarLayout>
                <SettingsPage />
              </SidebarLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;