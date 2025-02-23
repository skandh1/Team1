import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Loader2, 
  FolderKanban,
  Users,
  Calendar,
  Tag,
  AlertCircle
} from "lucide-react";
import ProjectApplicantsModal from "../components/ProjectApplicantsModal";

function MyProjectsPage() {
  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myProjects"],
    queryFn: async () => {
      const response = await axiosInstance.get("/editProject");
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => axiosInstance.delete(`/editProject/${id}`),
    onSuccess: () => {
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries(["myProjects"]);
      setConfirmDelete(null);
    },
    onError: () => {
      toast.error("Failed to delete project");
      setConfirmDelete(null);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isEnabled }) => 
      axiosInstance.patch(`/editProject/${id}`, { isEnabled: !isEnabled }),
    onSuccess: () => {
      toast.success("Project status updated successfully");
      queryClient.invalidateQueries(["myProjects"]);
    },
    onError: () => toast.error("Failed to update project status"),
  });

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading your projects...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Projects</h2>
          <p className="text-gray-600">
            We couldn't load your projects at this time. Please try again later.
          </p>
          <button 
            onClick={() => queryClient.invalidateQueries(["myProjects"])}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    selectedProject ? (
      <ProjectApplicantsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelect={(applicantId) => console.log("Selected applicant:", applicantId)}
      />
    ) : (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <FolderKanban className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          </div>

          {data.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <FolderKanban className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Projects Yet</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                You haven't created any projects yet. Start by creating your first project to begin collaborating with others.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {data.map((project) => (
                <div 
                  key={project._id} 
                  className={`
                    bg-white rounded-xl shadow-sm border transition-all duration-200
                    ${project.isEnabled ? 'border-gray-200' : 'border-gray-200 opacity-75'}
                    hover:shadow-md hover:border-blue-200
                  `}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {project.name}
                      </h2>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMutation.mutate({ 
                              id: project._id, 
                              isEnabled: project.isEnabled 
                            });
                          }}
                          className={`
                            p-2 rounded-lg transition-colors
                            ${project.isEnabled 
                              ? 'text-green-600 hover:bg-green-50' 
                              : 'text-gray-400 hover:bg-gray-50'}
                          `}
                          title={project.isEnabled ? 'Project is active' : 'Project is inactive'}
                        >
                          {project.isEnabled ? (
                            <ToggleRight className="w-6 h-6" />
                          ) : (
                            <ToggleLeft className="w-6 h-6" />
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Tag className="w-4 h-4" />
                        <span>{project.technologies.join(", ")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{project.applicants?.length || 0} Applicants</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-4">
                      <button
                        onClick={() => handleProjectClick(project)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Users className="w-4 h-4" />
                        View Applicants
                      </button>
                      {confirmDelete === project._id ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMutation.mutate(project._id);
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                          Confirm Delete
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete(project._id);
                          }}
                          className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  );
}

export default MyProjectsPage;