import { useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { useUserProfile } from "../hooks/useUserProfile";
import { userApi } from "../api/users";
import { problemApi } from "../api/problems";

function ProfilePage() {
  const { user: clerkUser } = useUser();
  const queryClient = useQueryClient();
  const { data, isLoading } = useUserProfile();

  const profile = data?.user;
  const stats = data?.stats;

  const [roleDraft, setRoleDraft] = useState(profile?.role || "participant");
  const [problemForm, setProblemForm] = useState({
    id: "",
    title: "",
    difficulty: "Easy",
    category: "General",
    descriptionText: "",
    starterCodeJs: "",
    expectedOutputJs: "",
  });

  const updateRoleMutation = useMutation({
    mutationFn: (newRole) => userApi.updateMe({ role: newRole }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const createProblemMutation = useMutation({
    mutationFn: (payload) => problemApi.createProblem(payload),
  });

  const syncUsersMutation = useMutation({
    mutationFn: () => userApi.syncUsersFromClerk(),
    onSuccess: (data) => {
      alert(`Synced ${data.updatedCount} users from Clerk!`);
    },
    onError: (error) => {
      alert(`Error syncing users: ${error.message}`);
    },
  });

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
                        clerkUser?.imageUrl ||
                        profile.profileImage ||
                        "https://api.dicebear.com/9.x/initials/svg?seed=" +
                          encodeURIComponent(clerkUser?.firstName || profile.firstName || "User")
                      }
                      alt={clerkUser?.fullName || profile.name}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">
                    {clerkUser?.firstName || profile.firstName} {clerkUser?.lastName || profile.lastName}
                  </h2>
                  <p className="text-base-content/70">
                    {clerkUser?.primaryEmailAddress?.emailAddress || profile.email}
                  </p>
                  <p className="text-xs text-base-content/60 mt-1">
                    Joined on {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <label className="text-sm font-medium">Role:</label>
                    <select
                      className="select select-sm select-bordered"
                      value={roleDraft}
                      onChange={(e) => setRoleDraft(e.target.value)}
                    >
                      <option value="participant">Participant</option>
                      <option value="host">Host</option>
                    </select>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => updateRoleMutation.mutate(roleDraft)}
                      disabled={updateRoleMutation.isPending || roleDraft === profile.role}
                    >
                      {updateRoleMutation.isPending ? "Saving..." : "Save"}
                    </button>
                  </div>
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

            {/* HOST-ONLY: SYNC USERS & CREATE PROBLEM */}
            {profile.role === "host" && (
              <>
                {/* SYNC USERS FROM CLERK */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title">Sync Users</h2>
                    <p className="text-sm text-base-content/70">
                      Sync all user data from Clerk to update names and emails in the database.
                    </p>
                    <button
                      className="btn btn-secondary mt-2 w-fit"
                      onClick={() => syncUsersMutation.mutate()}
                      disabled={syncUsersMutation.isPending}
                    >
                      {syncUsersMutation.isPending ? "Syncing..." : "Sync Users from Clerk"}
                    </button>
                  </div>
                </div>

                {/* CREATE PROBLEM */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body space-y-4">
                    <h2 className="card-title">Create a New Problem</h2>
                    <p className="text-sm text-base-content/70">
                      Problems you create will be available like other practice problems.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text">Problem ID (slug)</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="e.g. two-sum-variant"
                        value={problemForm.id}
                        onChange={(e) =>
                          setProblemForm((prev) => ({ ...prev, id: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Title</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="Problem title"
                        value={problemForm.title}
                        onChange={(e) =>
                          setProblemForm((prev) => ({ ...prev, title: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Difficulty</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={problemForm.difficulty}
                        onChange={(e) =>
                          setProblemForm((prev) => ({ ...prev, difficulty: e.target.value }))
                        }
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Category</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="e.g. Arrays, Strings"
                        value={problemForm.category}
                        onChange={(e) =>
                          setProblemForm((prev) => ({ ...prev, category: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Description</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered w-full min-h-[80px]"
                      placeholder="Describe the problem statement"
                      value={problemForm.descriptionText}
                      onChange={(e) =>
                        setProblemForm((prev) => ({ ...prev, descriptionText: e.target.value }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text">Starter Code (JavaScript)</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered w-full min-h-[120px] font-mono text-xs"
                        value={problemForm.starterCodeJs}
                        onChange={(e) =>
                          setProblemForm((prev) => ({ ...prev, starterCodeJs: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Expected Output (JavaScript)</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered w-full min-h-[120px] font-mono text-xs"
                        placeholder="What output should the correct solution produce?"
                        value={problemForm.expectedOutputJs}
                        onChange={(e) =>
                          setProblemForm((prev) => ({ ...prev, expectedOutputJs: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      className="btn btn-primary"
                      disabled={createProblemMutation.isPending}
                      onClick={() => {
                        const payload = {
                          id: problemForm.id.trim(),
                          title: problemForm.title.trim(),
                          difficulty: problemForm.difficulty,
                          category: problemForm.category.trim(),
                          descriptionText: problemForm.descriptionText.trim(),
                          notes: [],
                          examples: [],
                          constraints: [],
                          starterCode: {
                            javascript: problemForm.starterCodeJs,
                          },
                          expectedOutput: {
                            javascript: problemForm.expectedOutputJs,
                          },
                        };
                        createProblemMutation.mutate(payload, {
                          onSuccess: () => {
                            setProblemForm({
                              id: "",
                              title: "",
                              difficulty: "Easy",
                              category: "General",
                              descriptionText: "",
                              starterCodeJs: "",
                              expectedOutputJs: "",
                            });
                          },
                        });
                      }}
                    >
                      {createProblemMutation.isPending ? "Creating..." : "Create Problem"}
                    </button>
                    {createProblemMutation.isError && (
                      <p className="text-sm text-error">
                        {(createProblemMutation.error?.response?.data?.message) ||
                          "Failed to create problem"}
                      </p>
                    )}
                    {createProblemMutation.isSuccess && !createProblemMutation.isPending && (
                      <p className="text-sm text-success">Problem created successfully.</p>
                    )}
                  </div>
                </div>
              </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
