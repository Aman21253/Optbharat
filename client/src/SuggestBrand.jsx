import React, { useState } from "react";
import "./SuggestBrand.css";
import { supabase } from "./supabaseClient";

const SuggestBrand = () => {
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    website: "",
    category: "",
    targetGlobalBrand: "",
    reason: "",
    showcase: "",
    certifications: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const { error } = await supabase.from("brand_suggestions").insert([
        {
          name: formData.name,
          logo_url: formData.logoUrl,
          website: formData.website,
          category: formData.category,
          target_global_brand: formData.targetGlobalBrand,
          reason: formData.reason,
          showcase: formData.showcase,
          certifications: formData.certifications,
        },
      ]);

      if (error) {
        console.error("Supabase insert error:", error.message);
        setMessage("❌ Failed to submit suggestion.");
      } else {
        setMessage("✅ Brand suggestion submitted successfully!");
        setFormData({
          name: "",
          logoUrl: "",
          website: "",
          category: "",
          targetGlobalBrand: "",
          reason: "",
          showcase: "",
          certifications: "",
        });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage("❌ Server error. Please try again.");
    }
  };

  return (
    <div className="suggest-brand-container">
      <h2>Suggest an Indian Brand</h2>
      {message && <p className="message">{message}</p>}
      <form className="suggest-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Brand Name" value={formData.name} onChange={handleChange} required />
        <input name="logoUrl" placeholder="Logo URL" value={formData.logoUrl} onChange={handleChange} />
        <input name="website" placeholder="Website" value={formData.website} onChange={handleChange} />
        <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
        <input name="targetGlobalBrand" placeholder="Target Global Brand" value={formData.targetGlobalBrand} onChange={handleChange} />
        <textarea name="reason" placeholder="Why is this a good alternative?" value={formData.reason} onChange={handleChange} required />
        <textarea name="showcase" placeholder="Product Showcase or Portfolio" value={formData.showcase} onChange={handleChange} />
        <input name="certifications" placeholder="Certifications" value={formData.certifications} onChange={handleChange} />
        <button type="submit">Submit Suggestion</button>
      </form>
    </div>
  );
};

export default SuggestBrand;