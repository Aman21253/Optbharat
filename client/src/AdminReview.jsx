import React, { useEffect, useState } from "react";
import "./AdminReview.css";

import { supabase } from "./supabaseClient";

const AdminReview = () => {
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async () => {
    const { data, error } = await supabase
      .from("brand_suggestions")
      .select("*")
      .eq("approved", false);

    if (error) {
      console.error("❌ Error fetching suggestions:", error.message);
    } else {
      setSuggestions(data || []);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const approve = async (id) => {
    const suggestion = suggestions.find((s) => s.id === id);
    if (!suggestion) return;

    const {
      name,
      website,
      category,
      target_global_brand,
      reason,
      showcase,
      certifications,
    } = suggestion;

    const payload = {
      name,
      website,
      product_category: category,
      global_brand: target_global_brand,
      description: reason,
      country_of_origin: "India",
      positioning: "Comparable",
      country_of_operations: "India",
      approved: true,
      // optionally: createdBy, submitterEmail
    };

    const { error: insertError } = await supabase
      .from("brands")
      .insert([payload]);

    if (insertError) {
      console.error("❌ Error approving:", insertError.message);
      alert("❌ Failed to approve");
    } else {
      // Optional: delete suggestion
      await supabase.from("brand_suggestions").delete().eq("id", id);
      fetchSuggestions();
    }
  };

  const reject = async (id) => {
    const { error } = await supabase
      .from("brand_suggestions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("❌ Error rejecting:", error.message);
    } else {
      alert("❌ Brand rejected");
      fetchSuggestions();
    }
  };

  return (
    <div className="admin-review">
      <h2>Pending Brand Suggestions</h2>
      {suggestions.length === 0 ? (
        <p>No pending suggestions</p>
      ) : (
        suggestions.map((s, i) => (
          <div key={i} className="suggestion-card">
            <h3>{s.name}</h3>
            <p><strong>Website:</strong> {s.website}</p>
            <p><strong>Category:</strong> {s.category}</p>
            <p><strong>Target:</strong> {s.target_global_brand}</p>
            <p><strong>Reason:</strong> {s.reason}</p>
            <p><strong>Portfolio:</strong> {s.showcase}</p>
            <p><strong>Certifications:</strong> {s.certifications}</p>
            <button onClick={() => approve(s.id)}>✅ Approve</button>
            <button onClick={() => reject(s.id)}>❌ Reject</button>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminReview;