import connectDB from "../src/config/db.js";
import User from "../src/models/User.js";

const seedAdmin = async () => {
  try {
    await connectDB();

    const fullName = process.env.SUPERADMIN_NAME || "Alokit Super Admin";
    const email = (process.env.SUPERADMIN_EMAIL || "superadmin@alokit.co").toLowerCase();
    const password = process.env.SUPERADMIN_PASSWORD || "Admin@123456";
    const phone = process.env.SUPERADMIN_PHONE || "9999999999";

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.fullName = fullName;
      existingUser.password = password;
      existingUser.phone = phone;
      existingUser.role = "superAdmin";
      existingUser.isActive = true;
      await existingUser.save();

      console.log(`Super admin updated successfully: ${email}`);
    } else {
      await User.create({
        fullName,
        email,
        password,
        phone,
        role: "superAdmin"
      });

      console.log(`Super admin created successfully: ${email}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Failed to seed super admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
