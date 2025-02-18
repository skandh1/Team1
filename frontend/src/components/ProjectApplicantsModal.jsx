import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, X } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ProjectApplicantsModal = ({ project, onClose }) => {
  const queryClient = useQueryClient();

  // Fetch applicants and selected applicants
  const { data, isLoading, isError } = useQuery({
    queryKey: ["projectApplicants", project._id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/editproject/applicants/${project._id}`);
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to fetch applicants.");
    },
  });

  // Mutation to select an applicant
  const { mutate: selectApplicant } = useMutation({
    mutationFn: async (applicantId) => {
      await axiosInstance.post(`/editproject/select-applicant`, {
        projectId: project._id,
        applicantId,
      });
    },
    onSuccess: () => {
      toast.success("Applicant selected successfully!");
      queryClient.invalidateQueries(["projectApplicants", project._id]); // Refetch data
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to select applicant.");
    },
  });

  console.log(data)

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Applicants for {project.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={24} />
          </button>
        </div>

        {/* Applicants List */}
        <ul className="border p-2 rounded-md mt-2">
          {isLoading ? (
            <p className="text-gray-500">Loading applicants...</p>
          ) : isError ? (
            <p className="text-red-500">Failed to load applicants.</p>
          ) : data?.applicants.length > 0 ? (
            data.applicants.map((applicant) => (
              <li key={applicant._id} className="flex justify-between items-center text-gray-700 p-1">
                <Link to={`/profile/${applicant.username}`} className="block text-blue-500 hover:text-blue-600">
                  {applicant.name} ({applicant.email})
                </Link>
                <button
                  onClick={() => selectApplicant(applicant._id)}
                  className="text-green-500 hover:text-green-700"
                >
                  <CheckCircle size={20} />
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No applicants yet.</p>
          )}
        </ul>

        {/* Selected Applicants List */}
        <div className="mt-4 p-2 border rounded-md">
          <h3 className="text-lg font-semibold">Selected Applicants</h3>
          {data?.selectedApplicants?.length > 0 ? (
            <ul className="mt-2">
              {data.selectedApplicants.map((id) => (
                <li key={id._id} className="text-gray-700">{id.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No applicants selected yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectApplicantsModal;
