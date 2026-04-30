import { clerkClient } from "@clerk/express";

// Middleware (protect Educator router)
export const protectEducator = async (req, res, next) => {
  try {
    // ✅ Fix: req.auth() as function
    const userId = req.auth().userId;
    const response = await clerkClient.users.getUser(userId);
    if (response.publicMetadata.role !== "educator") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};