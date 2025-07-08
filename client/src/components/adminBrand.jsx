import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminBrands() {
  const navigate = useNavigate(); 
  const [brands, setBrands] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      navigate("/"); // Redirect if not admin/superadmin
      return;
    }
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/brands/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setBrands(data);
      } else {
        setMessage(data.error || "❌ Failed to load pending brands");
      }
    } catch (err) {
      console.error("❌ Error loading brands:", err);
      setMessage("❌ Server error while loading pending brands");
    }
  };

  const approveBrand = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/brands/${id}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Brand approved!");
        setBrands(brands.filter((b) => b._id !== id));
      } else {
        setMessage(data.error || "❌ Failed to approve brand");
      }
    } catch (err) {
      setMessage("❌ Server error while approving brand");
    }
  };

  const deleteBrand = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/brands/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setBrands(brands.filter((brand) => brand._id !== id));
        setMessage("🗑️ Brand deleted.");
      } else {
        const data = await res.json();
        setMessage(data.error || "❌ Failed to delete brand");
      }
    } catch (err) {
      setMessage("❌ Server error while deleting brand");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>🛠️ Admin – Pending Brand Listings</h2>
      {message && <p>{message}</p>}
      {brands.length === 0 ? (
        <p>No pending brands.</p>
      ) : (
        brands.map((brand) => (
          <div key={brand._id} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
            <h3>{brand.name}</h3>
            <p>
              <strong>Category:</strong> {brand.productCategory} |{" "}
              <strong>Origin:</strong> {brand.countryOfOrigin}
            </p>
            <p>{brand.description}</p>
            <button onClick={() => approveBrand(brand._id)} style={{ marginRight: "10px" }}>
              ✅ Approve
            </button>
            <button onClick={() => deleteBrand(brand._id)} style={{ color: "red" }}>
              🗑️ Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminBrands;