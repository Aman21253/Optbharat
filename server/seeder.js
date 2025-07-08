const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Brand = require("./models/brand.js");
const User = require("./models/User.js");
const bcrypt = require("bcryptjs");
const sampleBrands = require("./data/sampleBrand");

dotenv.config();
async function seedData() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/makeinindia');
    console.log("✅ MongoDB connected");

    await Brand.deleteMany({});

    async function createSuperAdmin() {
  const hashedPassword = await bcrypt.hash("SuperSecret123", 10);
  const superAdmin = await User.create({
    name: "Super Admin",
    email: process.env.TRUSTED_SUPERADMIN_EMAIL,
    password: "Aman@2003",
    role: "superadmin",
  });
  console.log("✅ Super Admin created:", superAdmin.email);
}

createSuperAdmin();

    const brandsWithApproval = sampleBrands.map((brand) => ({
      ...brand,
      approved: true,
    }));

    await Brand.insertMany(brandsWithApproval);
    //console.log(sampleBrands);
    console.log("✅ Sample data inserted!");
    process.exit(); // Exit when done
  } catch (err) {
    console.error("❌ Error during seeding:", err.message);
    process.exit(1);
  }
}

seedData(); 