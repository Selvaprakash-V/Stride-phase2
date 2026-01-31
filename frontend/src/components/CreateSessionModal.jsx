import { Code2Icon, LoaderIcon, PlusIcon, SearchIcon, UserPlusIcon, XIcon } from "lucide-react";
import { useState, useCallback } from "react";
import { useProblems } from "../hooks/useProblems";
import { userApi } from "../api/users";

// Helper function to get display name from user object
const getDisplayName = (user) => {
  if (user.firstName && user.firstName !== "User") {
    return `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`;
  }
  if (user.name && user.name !== "User") {
    return user.name;
  }
  // Fall back to email username if no name available
  return user.email?.split("@")[0] || "Unknown User";
};

// Helper to get initials for avatar
const getInitials = (user) => {
  if (user.firstName && user.firstName !== "User") {
    return user.firstName.charAt(0).toUpperCase();
  }
  if (user.name && user.name !== "User") {
    return user.name.charAt(0).toUpperCase();
  }
  if (user.email) {
    return user.email.charAt(0).toUpperCase();
  }
  return "U";
};

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const { data, isLoading } = useProblems();
  const problems = data?.problems || [];

  // Participant search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  // Debounced search function
  const handleSearch = useCallback(async (query) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await userApi.searchUsers(query);
      setSearchResults(response.users || []);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleSelectParticipant = (user) => {
    setSelectedParticipant(user);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRemoveParticipant = () => {
    setSelectedParticipant(null);
  };

  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedParticipant(null);
    onClose();
  };

  const handleCreateRoom = () => {
    onCreateRoom(selectedParticipant?._id || null);
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-2xl mb-6">Create New Session</h3>

        <div className="space-y-8">
          {/* PROBLEM SELECTION */}
          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">Select Problem</span>
              <span className="label-text-alt text-error">*</span>
            </label>

            <select
              className="select w-full"
              value={roomConfig.problem}
              onChange={(e) => {
                const selectedProblem = problems.find((p) => p.title === e.target.value);
                setRoomConfig({
                  difficulty: selectedProblem?.difficulty || "Easy",
                  problem: e.target.value,
                });
              }}
              disabled={isLoading}
            >
              <option value="" disabled>
                {isLoading ? "Loading problems..." : "Choose a coding problem..."}
              </option>

              {!isLoading &&
                problems.map((problem) => (
                <option key={problem.id} value={problem.title}>
                  {problem.title} ({problem.difficulty})
                </option>
                ))}
            </select>
          </div>

          {/* PARTICIPANT SELECTION */}
          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">Add Participant</span>
              <span className="label-text-alt text-info">(Optional)</span>
            </label>

            {selectedParticipant ? (
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    {selectedParticipant.profileImage ? (
                      <img src={selectedParticipant.profileImage} alt={getDisplayName(selectedParticipant)} />
                    ) : (
                      <div className="bg-primary text-primary-content flex items-center justify-center w-full h-full text-lg font-bold">
                        {getInitials(selectedParticipant)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {getDisplayName(selectedParticipant)}
                  </p>
                  <p className="text-sm text-base-content/70">{selectedParticipant.email}</p>
                </div>
                <button
                  className="btn btn-ghost btn-sm btn-circle"
                  onClick={handleRemoveParticipant}
                >
                  <XIcon className="size-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by first name, last name, or email..."
                    className="input w-full pl-10"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                  />
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-base-content/50" />
                  {isSearching && (
                    <LoaderIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-5 animate-spin text-base-content/50" />
                  )}
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((user) => (
                      <button
                        key={user._id}
                        className="w-full flex items-center gap-3 p-3 hover:bg-base-200 transition-colors text-left"
                        onClick={() => handleSelectParticipant(user)}
                      >
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            {user.profileImage ? (
                              <img src={user.profileImage} alt={getDisplayName(user)} />
                            ) : (
                              <div className="bg-primary text-primary-content flex items-center justify-center w-full h-full text-sm font-bold">
                                {getInitials(user)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{getDisplayName(user)}</p>
                          <p className="text-xs text-base-content/70 truncate">{user.email}</p>
                        </div>
                        <UserPlusIcon className="ml-auto size-4 text-primary flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}

                {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg p-4 text-center text-base-content/70">
                    No users found matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ROOM SUMMARY */}
          {roomConfig.problem && (
            <div className="alert alert-success">
              <Code2Icon className="size-5" />
              <div>
                <p className="font-semibold">Room Summary:</p>
                <p>
                  Problem: <span className="font-medium">{roomConfig.problem}</span>
                </p>
                {selectedParticipant && (
                  <p>
                    Participant: <span className="font-medium">{getDisplayName(selectedParticipant)}</span>
                    <span className="text-sm opacity-70"> ({selectedParticipant.email})</span>
                  </p>
                )}
                <p>
                  Max Participants: <span className="font-medium">2 (1-on-1 session)</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={handleClose}>
            Cancel
          </button>

          <button
            className="btn btn-primary gap-2"
            onClick={handleCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              <PlusIcon className="size-5" />
            )}

            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  );
}
export default CreateSessionModal;
