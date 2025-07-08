import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddListing.css";

function AddListing() {
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    productCategory: "",
    globalBrand: "",
    description: "",
    countryOfOrigin: "",  
    countryOfOperations: "",
    positioning: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); 

    const payload = {
      name: formData.name,
      website: formData.website,
      productCategory: formData.productCategory,
      globalBrand: formData.globalBrand,
      description: formData.description,
      countryOfOrigin: formData.countryOfOrigin,
      countryOfOperations: formData.countryOfOperations,
      positioning: formData.positioning,
    };

    try {
      const res = await fetch("http://localhost:8080/api/brands", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" ,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Listing submitted for approval!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        setMessage(data.error || "Failed to add listing.");
      }
    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
    <div className="add-form-container">
      <h2>📋 Add New Indian Brand Listing</h2>
      <form onSubmit={handleSubmit} className="listing-form">
        <input name="name" placeholder="Brand Name" onChange={handleChange} required />
        {/* <input name="logo" placeholder="Logo URL" onChange={handleChange} /> */}
        <input name="website" placeholder="Website" onChange={handleChange} />
        <input name="productCategory" placeholder="Product Category" onChange={handleChange} required />
        <input name="globalBrand" placeholder="Alternative to (Global Brand)" onChange={handleChange} />
        <textarea name="description" placeholder="Why is this a good alternative?" onChange={handleChange} required />

        <input name="countryOfOrigin" placeholder="Country of Origin" onChange={handleChange} required />
        <input name="countryOfOperations" placeholder="Country of Operations" onChange={handleChange} required />
        <select name="positioning" onChange={handleChange} required>
          <option value="">Select Positioning</option>
          <option value="Comparable">Comparable</option>
          <option value="Premium">Premium</option>
          <option value="Mass-market">Mass-market</option>
        </select>

        <button type="submit">Add Listing</button>
        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
}

export default AddListing;