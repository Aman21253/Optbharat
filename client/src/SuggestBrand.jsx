import React, { useState } from "react";
import "./SuggestBrand.css";

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

    try {
      console.log("Submitting:", formData);
      const res = await fetch("http://localhost:8080/api/brand-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to submit suggestion.");
      }

      const result = await res.json();
      setMessage("Brand suggestion submitted successfully!");
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
    } catch (error) {
      console.error("Error submitting brand:", error);
      setMessage("Error submitting brand. Please try again.");
    }
  };

  return (
    <div className="suggest-brand-container">
      <h2>Suggest an Indian Brand</h2>
      {message && <p className="message">{message}</p>}
      <form className="suggest-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Brand Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="logoUrl"
          placeholder="Logo URL"
          value={formData.logoUrl}
          onChange={handleChange}
        />
        <input
          type="text"
          name="website"
          placeholder="Website"
          value={formData.website}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category (e.g., Footwear, Electronics)"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="targetGlobalBrand"
          placeholder="Target Global Brand"
          value={formData.targetGlobalBrand}
          onChange={handleChange}
        />
        <textarea
          name="reason"
          placeholder="Why is this a good alternative?"
          value={formData.reason}
          onChange={handleChange}
          required
        ></textarea>
        <textarea
          name="showcase"
          placeholder="Product Showcase or Portfolio (optional)"
          value={formData.showcase}
          onChange={handleChange}
        ></textarea>
        <input
          type="text"
          name="certifications"
          placeholder="Certifications or Accolades (optional)"
          value={formData.certifications}
          onChange={handleChange}
        />
        <button type="submit">Submit Suggestion</button>
      </form>
    </div>
  );
};

export default SuggestBrand;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./SuggestBrand.css";

// const SuggestBrand = ({ onNewSuggestion }) => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     logoUrl: "",
//     website: "",
//     category: "",
//     targetGlobalBrand: "",
//     reason: "",
//     showcase: "",
//     certifications: "",
//   });

//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch("http://localhost:8080/api/brand-suggestions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) throw new Error("Failed to submit suggestion.");

//       const result = await res.json();

//       // Add to main brand list
//       onNewSuggestion({
//         name: formData.name,
//         countryOfOrigin: "India",
//         productCategory: formData.category,
//         description: formData.reason,
//         productRange: formData.showcase,
//         priceSegment: "Mid", // optional default
//         features: formData.certifications,
//         website: formData.website,
//       });

//       setMessage("Suggestion submitted!");
//       navigate("/"); // redirect to home
//     } catch (error) {
//       console.error("Error submitting brand:", error);
//       setMessage("Error submitting brand.");
//     }
//   };

//   return (
//     <div className="suggest-brand-container">
//       <h2>Suggest an Indian Brand</h2>
//       {message && <p className="message">{message}</p>}
//       <form className="suggest-form" onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="name"
//           placeholder="Brand Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="logoUrl"
//           placeholder="Logo URL"
//           value={formData.logoUrl}
//           onChange={handleChange}
//         />
//         <input
//           type="text"
//           name="website"
//           placeholder="Website"
//           value={formData.website}
//           onChange={handleChange}
//         />
//         <input
//           type="text"
//           name="category"
//           placeholder="Category"
//           value={formData.category}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="targetGlobalBrand"
//           placeholder="Target Global Brand"
//           value={formData.targetGlobalBrand}
//           onChange={handleChange}
//         />
//         <textarea
//           name="reason"
//           placeholder="Why is this a good alternative?"
//           value={formData.reason}
//           onChange={handleChange}
//           required
//         ></textarea>
//         <textarea
//           name="showcase"
//           placeholder="Product Showcase"
//           value={formData.showcase}
//           onChange={handleChange}
//         ></textarea>
//         <input
//           type="text"
//           name="certifications"
//           placeholder="Certifications (optional)"
//           value={formData.certifications}
//           onChange={handleChange}
//         />
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default SuggestBrand;