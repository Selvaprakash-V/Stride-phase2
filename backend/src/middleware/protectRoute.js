import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const { userId, sessionClaims } = req.auth();
      const clerkId = userId;

      if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

      // Try to find existing user by Clerk ID
      let user = await User.findOne({ clerkId });

      // Auto-create user in MongoDB on first authenticated request if missing
      if (!user) {
        const givenName = sessionClaims?.given_name;
        const familyName = sessionClaims?.family_name;
        const fullName = [givenName, familyName].filter(Boolean).join(" ");

        const emailFromClaims =
          sessionClaims?.email ||
          sessionClaims?.email_address ||
          sessionClaims?.email_addresses?.[0]?.email_address;

        user = await User.create({
          clerkId,
          name: fullName || "User",
          email: emailFromClaims || `${clerkId}@example.com`,
          profileImage: "",
        });
      }

      // attach user to req
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
