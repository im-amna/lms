import { clerkClient } from "@clerk/express";

//Middleware    (protect Educator router)

export const protectEducator = async (req, res, next) => {
  try {
    console.log(req.auth.userId);
    const userId = req.auth.userId;
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
