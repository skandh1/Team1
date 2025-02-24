import React, { useState, useEffect } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { axiosInstance } from "../lib/axios";

export default function RatingModal({ project, onClose, onSubmit }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState({});
  const [alreadyRatedUsers, setAlreadyRatedUsers] = useState(new Set());

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        let selectedApplicants = [];
        let projectId = typeof project === "string" ? project : project?._id; // Ensure we have a valid project ID
        // If project is just an ID, fetch full project details
        if (typeof project === "string") {
          const response = await axiosInstance.get(`/project/${project}`);
          selectedApplicants = response.data.map(val => val._id) || [];
          console.log(response.data); // Ensure project ID is set
        } else {
          selectedApplicants = project?.selectedApplicants || []; 
        }

        if (!projectId) {
          throw new Error("Invalid project data: Missing project ID");
        }
  
        // If no applicants, show error and return
        if (!selectedApplicants.length) {
          setError("No team members found to rate");
          setLoading(false);
          return;
        }
  
        // Fetch applicants' details
        console.log(selectedApplicants)
        const userResponse = await axiosInstance.post("/editproject/user/details", {
          userIds: selectedApplicants,
        });
  
        if (!userResponse?.data?.users || !Array.isArray(userResponse.data.users)) {
          throw new Error("Invalid response format from server");
        }
  
        console.log("Received applicants data:", userResponse.data.users);
  
        // Fetch already rated users
        const ratingsResponse = await axiosInstance.get(`/editproject/${projectId}/ratings`); // Use `projectId`
        const existingRatedUsers = new Set(ratingsResponse.data.ratings.map((r) => r.reviewee));
        setAlreadyRatedUsers(existingRatedUsers);
  
        setApplicants(userResponse.data.users);
  
        // Initialize ratings only for unrated users
        const initialRatings = userResponse.data.users.reduce((acc, applicant) => {
          if (applicant?._id && !existingRatedUsers.has(applicant._id)) {
            return {
              ...acc,
              [applicant._id]: { rating: 0, feedback: "" },
            };
          }
          return acc;
        }, {});
  
        console.log("Initialized ratings:", initialRatings);
        setRatings(initialRatings);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError(err.response?.data?.message || err.message || "Failed to load team members");
        setLoading(false);
      }
    };
  
    fetchApplicants();
  }, [project]);
  

  const handleRatingChange = (userId, rating) => {
    if (!userId || alreadyRatedUsers.has(userId)) return;
    setRatings((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], rating },
    }));
  };

  const handleFeedbackChange = (userId, feedback) => {
    if (!userId || alreadyRatedUsers.has(userId)) return;
    setRatings((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], feedback },
    }));
  };

  const handleSubmit = () => {
    // Validate ratings before submission
    const ratingArray = Object.entries(ratings)
      .filter(
        ([userId, data]) => data.rating > 0 && !alreadyRatedUsers.has(userId)
      ) // Only include unrated users
      .map(([userId, data]) => ({
        userId,
        rating: data.rating,
        feedback: data.feedback.trim(),
      }));

    if (ratingArray.length === 0) {
      setError("Please rate at least one team member");
      return;
    }

    console.log("Submitting ratings:", ratingArray);
    onSubmit(ratingArray);
  };

  const handleSkip = () => {
    onSubmit([]);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading team members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Rate Project Contributors
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {applicants.length === 0 ? (
            <p className="text-center text-gray-500">
              No team members found to rate.
            </p>
          ) : (
            applicants.map((applicant) => (
              <div
                key={applicant._id}
                className={`border rounded-lg p-4 ${
                  alreadyRatedUsers.has(applicant._id)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {applicant.name || "Unknown User"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {applicant.headline || applicant.role || "Team Member"}
                    </p>
                    {alreadyRatedUsers.has(applicant._id) && (
                      <p className="text-xs text-orange-600 mt-1">
                        Already rated
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(applicant._id, star)}
                        disabled={alreadyRatedUsers.has(applicant._id)}
                        className={`p-1 transition-colors ${
                          alreadyRatedUsers.has(applicant._id)
                            ? "text-gray-300 cursor-not-allowed"
                            : ratings[applicant._id]?.rating >= star
                            ? "text-yellow-400"
                            : "text-gray-300 hover:text-yellow-400"
                        }`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  placeholder={
                    alreadyRatedUsers.has(applicant._id)
                      ? "User already rated"
                      : "Add feedback (optional)"
                  }
                  value={ratings[applicant._id]?.feedback || ""}
                  onChange={(e) =>
                    handleFeedbackChange(applicant._id, e.target.value)
                  }
                  disabled={alreadyRatedUsers.has(applicant._id)}
                  className={`mt-3 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                    alreadyRatedUsers.has(applicant._id)
                      ? "bg-gray-50 cursor-not-allowed"
                      : ""
                  }`}
                  rows={2}
                />
              </div>
            ))
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex flex-col sm:flex-row gap-2 justify-end">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Skip Rating
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Ratings
          </button>
        </div>
      </div>
    </div>
  );
}
