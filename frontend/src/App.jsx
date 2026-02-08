import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import DonorDashboard from "./pages/DonorDashboard.jsx";
import NGODashboard from "./components/NGODashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminDonors from "./pages/AdminDonors.jsx";
import AdminNGOs from "./pages/AdminNGOs.jsx";
import AdminRequests from "./pages/AdminRequests.jsx";
import LoginSelection from "./pages/LoginSelection.jsx";
import RegisterSelection from "./pages/RegisterSelection.jsx";
import DonorLogin from "./pages/DonorLogin.jsx";
import NGOLogin from "./pages/NGOLogin.jsx";
import DonorRegistration from "./pages/DonorRegistration.jsx";
import NGORegistration from "./pages/NGORegistration.jsx";
import CreateFundraiser from "./pages/CreateFundraiser.jsx";
import DonateFundraiser from "./pages/DonateFundraiser.jsx";
import FundraiserList from "./pages/FundraiserList.jsx";
import FundraiserResponses from "./pages/FundraiserResponses.jsx";
import TrackContributions from "./pages/TrackContributions.jsx";
import TrackRequests from "./pages/TrackRequests.jsx";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="bg-white">
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Login Routes */}
        <Route path="/login" element={<LoginSelection />} />
        <Route path="/login/donor" element={<DonorLogin />} />
        <Route path="/login/ngo" element={<NGOLogin />} />

        {/* Register Routes */}
        <Route path="/register" element={<RegisterSelection />} />
        <Route path="/register/donor" element={<DonorRegistration />} />
        <Route path="/register/ngo" element={<NGORegistration />} />

        {/* Fundraiser Routes */}
        <Route path="/fundraisers" element={<FundraiserList />} />

        <Route
          path="/create-fundraiser"
          element={
            <ProtectedRoute requireNGO={true}>
              <CreateFundraiser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/donate-fundraiser/:requestId"
          element={
            <ProtectedRoute requireDonor={true}>
              <DonateFundraiser />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/donor-dashboard"
          element={
            <ProtectedRoute requireDonor={true}>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo-dashboard"
          element={
            <ProtectedRoute requireNGO={true}>
              <NGODashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/track-requests"
          element={
            <ProtectedRoute requireNGO={true}>
              <TrackRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/track-contributions"
          element={
            <ProtectedRoute requireDonor={true}>
              <TrackContributions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fundraiser-responses"
          element={
            <ProtectedRoute requireNGO={true}>
              <FundraiserResponses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/donors"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDonors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ngos"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminNGOs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminRequests />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
