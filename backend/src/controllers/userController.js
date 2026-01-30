import Session from "../models/Session.js";
import User from "../models/User.js";

export async function getMe(req, res) {
  try {
    const user = req.user; // attached by protectRoute

    // basic stats about user's work/sessions
    const [hostedCount, participantCount, completedHostedCount, completedParticipantCount] =
      await Promise.all([
        Session.countDocuments({ host: user._id }),
        Session.countDocuments({ participant: user._id }),
        Session.countDocuments({ host: user._id, status: "completed" }),
        Session.countDocuments({ participant: user._id, status: "completed" }),
      ]);

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        clerkId: user.clerkId,
        role: user.role,
        createdAt: user.createdAt,
      },
      stats: {
        hostedSessions: hostedCount,
        participatedSessions: participantCount,
        completedHostedSessions: completedHostedCount,
        completedParticipatedSessions: completedParticipantCount,
      },
    });
  } catch (error) {
    console.error("Error in getMe controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateMe(req, res) {
  try {
    const authUser = req.user; // attached by protectRoute
    const { role } = req.body;

    const allowedRoles = ["host", "participant"];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(authUser._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (role) {
      user.role = role;
    }

    await user.save();

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        clerkId: user.clerkId,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in updateMe controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
