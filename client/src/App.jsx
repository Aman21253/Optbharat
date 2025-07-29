import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import { supabase } from "./supabaseClient";

import Home from "./Home";
import SuggestBrand from "./SuggestBrand";
import AdminReview from "./admin/AdminReview";
import SignUp from "./components/signup";
import Auth from "./components/auth";
import BrandDetail from "./components/brandDetail";
import AddListing from "./components/addListing";
import AdminBrands from "./admin/adminBrand";
import Bookmarks from "./components/bookmark";
import WhyIndianProduct from "./components/reason";
import VerifyOtp from "./components/verifyOtp";
import AdminPending from "./admin/AdminPending";

const ProtectedAdminRoute = ({ user, children }) => {
  const role = user?.user_metadata?.role || user?.role;

  if (!user || (role !== "admin" && role !== "superadmin")) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUser(data.session.user);
      }
    };
    getSession();
  }, []);

  return (
    <div className="app-wrapper">
      <Router>
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/suggest" element={<SuggestBrand />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/add" element={<AddListing />} />
            <Route path="/brands/:id" element={<BrandDetail />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/admin/pending" element={<AdminPending />} />
            <Route path="/reason" element={<WhyIndianProduct />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute user={user}>
                  <AdminReview />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/brands"
              element={
                <ProtectedAdminRoute user={user}>
                  <AdminBrands />
                </ProtectedAdminRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;