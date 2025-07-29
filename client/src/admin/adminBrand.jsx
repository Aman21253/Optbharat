import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function AdminBrands() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAndFetch = async () => {
      const { data: session, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Session error:", error.message);
        setMessage("❌ Failed to fetch session");
        setLoading(false);
        return;
      }

      const user = session?.session?.user;
      const role = user?.user_metadata?.role;

      if (!user || (role !== "admin" && role !== "superadmin")) {
        navigate("/");
        return;
      }

      fetchPending();
    };

    checkAndFetch();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("approved", false);

    if (error) {
      console.error("❌ Error loading brands:", error.message);
      setMessage("❌ Failed to load pending brands");
    } else {
      setBrands(data);
    }

    setLoading(false);
  };

  const approveBrand = async (id) => {
    const { error } = await supabase
      .from("brands")
      .update({ approved: true })
      .eq("id", id);

    if (error) {
      console.error("❌ Approve failed:", error.message);
      setMessage("❌ Failed to approve brand");
    } else {
      setMessage("✅ Brand approved!");
      setBrands((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const deleteBrand = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;

    const { error } = await supabase
      .from("brands")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("❌ Delete failed:", error.message);
      setMessage("❌ Failed to delete brand");
    } else {
      setMessage("🗑️ Brand deleted.");
      setBrands((prev) => prev.filter((b) => b.id !== id));
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>🛠️ Admin – Pending Brand Listings</h2>

      {message && <p>{message}</p>}
      {loading ? (
        <p>⏳ Loading pending brands...</p>
      ) : brands.length === 0 ? (
        <p>No pending brands to approve.</p>
      ) : (
        brands.map((brand) => (
          <div
            key={brand.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "20px",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3>{brand.name}</h3>
            <p>
              <strong>Category:</strong> {brand.product_category} <br />
              <strong>Origin:</strong> {brand.country_of_origin}
            </p>
            <p>{brand.description}</p>

            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => approveBrand(brand.id)}
                style={{
                  marginRight: "10px",
                  padding: "8px 12px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                ✅ Approve
              </button>

              <button
                onClick={() => deleteBrand(brand.id)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminBrands;