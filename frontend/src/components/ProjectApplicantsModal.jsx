import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, X, Loader2, UserCheck, Users } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ProjectApplicantsModal = ({ project, onClose }) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["projectApplicants", project._id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/editproject/applicants/${project._id}`
      );
      return response.data;
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to fetch applicants."
      );
    },
  });

  const { mutate: handleRemoveApplicant } = useMutation({
    mutationFn: async (applicantId) =>
      axiosInstance.post(`/editProject/remove-applicant`, {
        projectId: project._id,
        applicantId,
      }),
    onSuccess: () => {
      toast.success("user Removed successfully");
      queryClient.invalidateQueries(["myProjects"]);
    },
    onError: () => toast.error("Failed to update project status"),
  });

  const { mutate: selectApplicant, isLoading: isSelecting } = useMutation({
    mutationFn: async (applicantId) => {
      await axiosInstance.post(`/editproject/select-applicant`, {
        projectId: project._id,
        applicantId,
      });
    },
    onSuccess: () => {
      toast.success("Applicant selected successfully!");
      queryClient.invalidateQueries(["projectApplicants", project._id]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to select applicant."
      );
    },
  });

  return (
    <div
      className={`fixed inset-0 flex z-10 items-center justify-center bg-black/50 p-4 backdrop-blur-sm`}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden mt-24">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Project Applicants
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className={`p-6 overflow-y-auto max-h-[calc(90vh-80px)] ${
            project.status === "Completed"
              ? "pointer-events-none cursor-none opacity-50"
              : ""
          }`}
        >
          {/* Pending Applicants Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Pending Applications
              </h3>
              <span className="bg-blue-100 text-blue-700 text-sm px-2 py-0.5 rounded-full">
                {data?.applicants?.length || 0}
              </span>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : isError ? (
              <div className="text-center py-8 text-red-600">
                Failed to load applicants. Please try again.
              </div>
            ) : data?.applicants?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No pending applications yet.
              </div>
            ) : (
              <div className="grid gap-4">
                {data.applicants.map((applicant) => (
                  <div
                    key={applicant._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Link
                      to={`/profile/${applicant.username}`}
                      className="flex items-center gap-3 flex-1"
                    >
                      <img
                        src={
                          applicant.avatar ||
                          `https://ui-avatars.com/api/?name=${applicant.name}`
                        }
                        alt={applicant.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {applicant.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {applicant.email}
                        </p>
                      </div>
                    </Link>
                    <button
                      onClick={() => selectApplicant(applicant._id)}
                      disabled={isSelecting}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Select
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Applicants Section */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Selected Team Members
              </h3>
              <span className="bg-green-100 text-green-700 text-sm px-2 py-0.5 rounded-full">
                {data?.selectedApplicants?.length || 0}
              </span>
            </div>

            {data?.selectedApplicants?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No team members selected yet.
              </div>
            ) : (
              <div className="grid gap-4">
                {data?.selectedApplicants?.map((user) => (
                  <div
                    key={user._id}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors flex items-center justify-between"
                  >
                    <Link
                      to={`/profile/${user.username}`}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${user.name}`
                        }
                        alt={user.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">
                            {user.name}
                          </h4>
                          <UserCheck className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-sm text-gray-500">
                          @{user.username}
                        </p>
                        {user.bio && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {user.bio}
                          </p>
                        )}
                      </div>
                    </Link>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleRemoveApplicant(user._id)}
                    >
                      Remove Applicant
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectApplicantsModal;
