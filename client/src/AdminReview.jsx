import React, { useEffect, useState } from "react";
import "./AdminReview.css";

const AdminReview = () => {
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = () => {
    fetch("http://localhost:8080/api/brand-suggestions")
      .then((res) => res.json())
      .then((data) => setSuggestions(data))
      .catch((err) => console.error("Error fetching suggestions:", err));
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const approve = (id) => {
    fetch(`http://localhost:8080/api/brand-suggestions/approve/${id}`, {
      method: "POST",
    })
      .then(() => {
        alert("Brand approved");
        fetchSuggestions();
      })
      .catch((err) => console.error("Error approving:", err));
  };

  const reject = (id) => {
    fetch(`http://localhost:8080/api/brand-suggestions/reject/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        alert("Brand rejected");
        fetchSuggestions();
      })
      .catch((err) => console.error("Error rejecting:", err));
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
            <p><strong>Target:</strong> {s.globalBrand}</p>
            <p><strong>Reason:</strong> {s.reason}</p>
            <p><strong>Portfolio:</strong> {s.portfolio}</p>
            <p><strong>Certifications:</strong> {s.certifications}</p>
            <button onClick={() => approve(s._id)}>Approve</button>
            <button onClick={() => reject(s._id)}>Reject</button>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminReview;