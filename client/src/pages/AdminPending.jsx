import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Header from "../components/header";
import "./AdminPending.css"; // optional styling

function AdminPending() {
  const [pendingBrands, setPendingBrands] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPendingBrands = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pending_brand")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Error fetching pending brands:", error.message);
      setMessage("Failed to load pending brands.");
    } else {
      setPendingBrands(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingBrands();
  }, []);

  const handleApprove = async (brand) => {
    const confirmed = window.confirm(`Approve ${brand.name}?`);
    if (!confirmed) return;

    try {
      const { error: insertError } = await supabase.from("brands").insert([
        {
          name: brand.name,
          Website: brand.Website,
          product_category: brand.product_category,
          global_brand: brand.global_brand,
          description: brand.description,
          positioning: brand.positioning,
          country_of_origin: brand.country_of_origin,
          country_of_operation: brand.country_of_operation,
          approved: true,
          created_by: brand.created_by,
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      const { error: deleteError } = await supabase
        .from("pending_brand")
        .delete()
        .eq("id", brand.id);

      if (deleteError){
        console.error("Delete error:", deleteError.message);
        setMessage("❌ Failed to remove from pending list.");
        return;
      } 

      setMessage(`✅ Approved "${brand.name}"`);
      fetchPendingBrands();
    } catch (err) {
      console.error("❌ Approval failed:", err.message);
      setMessage("❌ Failed to approve brand. See console for details.");
    }
  };

    const handleReject = async (brand) => {
        const confirmed = window.confirm(`Reject ${brand.name}?`);
        if (!confirmed) return;

        try {
          const { error } = await supabase
            .from("pending_brand")
            .delete()
            .eq("id", brand.id);

          if (error) {
            console.error("❌ Reject error:", error.message);
            setMessage("❌ Failed to reject brand.");
          } else {
            setMessage(`❌ Rejected "${brand.name}"`);
            fetchPendingBrands(); // refresh the list
          }
        } catch (err) {
          console.error("❌ Unexpected error:", err.message);
          setMessage("❌ Something went wrong while rejecting.");
        }
    };

  return (
    <>
    <Header/>
    <div className="admin-container">
      <h1>🛠️ Pending Brand Submissions</h1>

      {message && <div className="message">{message}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : pendingBrands.length === 0 ? (
        <p>No pending submissions</p>
      ) : (
        <div className="pending-list">
          {pendingBrands.map((brand) => (
            <div className="pending-card" key={brand.id}>
              <h2>{brand.name}</h2>
              <p><strong>Category:</strong> {brand.product_category}</p>
              <p><strong>Description:</strong> {brand.description}</p>
              <p><strong>Origin:</strong> {brand.country_of_origin}</p>
              <p><strong>Operation:</strong> {brand.country_of_operation}</p>
              <p><strong>Positioning:</strong> {brand.positioning}</p>
              <p><strong>Website:</strong> <a href={brand.Website} target="_blank">{brand.Website}</a></p>

              <button className="approve-btn" onClick={() => handleApprove(brand)}>
                ✅ Approve
              </button>
              <button className="reject-btn" onClick={() => handleReject(brand)}>
                ❌ Reject
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}

export default AdminPending;