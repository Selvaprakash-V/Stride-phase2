import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import { useUserProfile } from "../hooks/useUserProfile";

function ProfilePage() {
  const { user: clerkUser } = useUser();
  const { data, isLoading } = useUserProfile();

  const profile = data?.user;
  const stats = data?.stats;

  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

        {isLoading && <p className="text-base-content/70">Loading profile...</p>}

        {!isLoading && profile && (
          <div className="space-y-8">
            {/* BASIC INFO */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="avatar">
                  <div className="w-16 rounded-full">
                    <img
                      src={
                        profile.profileImage ||
                        clerkUser?.imageUrl ||
                        "https://api.dicebear.com/9.x/initials/svg?seed=" +
                          encodeURIComponent(profile.name || "User")
                      }
                      alt={profile.name}
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{profile.name}</h2>
                  <p className="text-base-content/70">{profile.email}</p>
                  <p className="text-xs text-base-content/60 mt-1">
                    Joined on {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* WORK / SESSIONS SUMMARY */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="card bg-base-100 shadow">
                  <div className="card-body">
                    <h3 className="card-title text-sm text-base-content/70 mb-1">
                      Sessions Hosted
                    </h3>
                    <p className="text-3xl font-bold">{stats.hostedSessions}</p>
                    <p className="text-xs text-base-content/60 mt-1">
                      Total sessions you created as host.
                    </p>
                  </div>
                </div>
                <div className="card bg-base-100 shadow">
                  <div className="card-body">
                    <h3 className="card-title text-sm text-base-content/70 mb-1">
                      Sessions Joined
                    </h3>
                    <p className="text-3xl font-bold">{stats.participatedSessions}</p>
                    <p className="text-xs text-base-content/60 mt-1">
                      Sessions where you joined as a participant.
                    </p>
                  </div>
                </div>
                <div className="card bg-base-100 shadow">
                  <div className="card-body">
                    <h3 className="card-title text-sm text-base-content/70 mb-1">
                      Completed as Host
                    </h3>
                    <p className="text-3xl font-bold">{stats.completedHostedSessions}</p>
                  </div>
                </div>
                <div className="card bg-base-100 shadow">
                  <div className="card-body">
                    <h3 className="card-title text-sm text-base-content/70 mb-1">
                      Completed as Participant
                    </h3>
                    <p className="text-3xl font-bold">{stats.completedParticipatedSessions}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
