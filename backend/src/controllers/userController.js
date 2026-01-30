import Session from "../models/Session.js";

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
