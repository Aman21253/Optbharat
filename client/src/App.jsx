import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
//import Header from "./header";
import Home from "./Home";
import SuggestBrand from "./SuggestBrand";
import AdminReview from "./AdminReview";
import SignUp from "./components/signup";
import Auth from "./components/auth";
import BrandDetail from "./components/brandDetail";
import AddListing from "./components/addListing";
import AdminBrands from "./components/adminBrand";
import Bookmarks from "./components/bookmark";
import VerifyOtp from "./components/verifyOtp";
import Footer from "./components/footer";

const ProtectedAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <div className="app-wrapper">
      <Router>
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/suggest" element={<SuggestBrand />} />
            <Route path="/admin" element={<AdminReview />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/add" element={<AddListing />} />
            <Route path="/admin/brands" element={<AdminBrands />} />
            <Route path="/brands/:id" element={<BrandDetail />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/admin" element={ <ProtectedAdminRoute>
                  <AdminReview />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/brands"
              element={
                <ProtectedAdminRoute>
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