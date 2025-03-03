import { useState, useEffect } from "react";
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
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Shield,
  Search,
  Filter,
  Play,
} from "lucide-react";
import ProjectApplicantsModal from "../components/ProjectApplicantsModal.jsx";
import RatingModal from "../components/RatingModel";

function MyProjectsPage() {
  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [ratingProject, setRatingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");

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

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) =>
      axiosInstance.patch(`/editProject/status/${id}`, { status }),
    onSuccess: (_, variables) => {
      toast.success("Project status updated successfully");
      queryClient.invalidateQueries(["myProjects"]);
      console.log(variables, data);
      if (variables.status === "Completed") {
        const project = data.find((p) => p._id === variables.id);
        if (project?.selectedApplicants?.length > 0) {
          setRatingProject(project);
        }
      }
    },
    onError: () => toast.error("Failed to update project status"),
  });

  const startProjectMutation = useMutation({
    mutationFn: async (id) => axiosInstance.post(`/editProject/start/${id}`),
    onSuccess: () => {  
      toast.success("Project started successfully");
      queryClient.invalidateQueries(["myProjects"]);
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to start project"),
  });

  const submitRatingsMutation = useMutation({
    mutationFn: async ({ projectId, ratings }) =>
      axiosInstance.post(`/editProject/${projectId}/ratings`, { ratings }),
    onSuccess: () => {
      toast.success("Ratings submitted successfully");
      setRatingProject(null);
    },
    onError: () => {
      toast.error("Failed to submit ratings");
      setRatingProject(null);
    },
  });

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleRatingSubmit = (ratings) => {
    if (ratings.length > 0) {
      submitRatingsMutation.mutate({
        projectId: ratingProject._id,
        ratings,
      });
    } else {
      setRatingProject(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "In_progress":
        return <Play className="w-4 h-4 text-yellow-600" />;
      case "Open":
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "In_progress":
        return "bg-yellow-100 text-yellow-800";
      case "Open":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const redirectToCreateProject = () => {
    window.location.href = "/createprojectpage";
  };

  const handleStartProject = (projectId) => {
    startProjectMutation.mutate(projectId);
  };

  // Filter and sort projects
  const filteredProjects = data
    ? data.filter((project) => {
        // Search term filter
        const matchesSearch =
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase());

        // Status filter
        const matchesStatus =
          statusFilter === "all" || project.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
    : [];

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortOrder === "latest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading your projects...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Projects
          </h2>
          <p className="text-gray-600">
            We couldn't load your projects at this time. Please try again later.
          </p>
          <button
            onClick={() => queryClient.invalidateQueries(["myProjects"])}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            type="button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {selectedProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={() => setSelectedProject(null)}
            ></div>
            <div className="relative z-10">
              <ProjectApplicantsModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
                onSelect={(applicantId) =>
                  console.log("Selected applicant:", applicantId)
                }
              />
            </div>
          </div>
        </div>
      )}

      {ratingProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={() => setRatingProject(null)}
            ></div>
            <div className="relative z-10">
              <RatingModal
                project={ratingProject}
                onClose={() => setRatingProject(null)}
                onSubmit={handleRatingSubmit}
              />
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8 w-full">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FolderKanban className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                My Projects
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              {filteredProjects.length || 0}{" "}
              {filteredProjects.length === 1 ? "project" : "projects"} found
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <div className="flex items-center">
                    <Filter className="h-5 w-5 text-gray-400 mr-2" />
                    <select
                      className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="Open">Open</option>
                      <option value="In_progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="relative">
                  <select
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="latest">Latest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
              <button
                onClick={redirectToCreateProject}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                type="button"
              >
                Create Project
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {sortedProjects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center w-full">
              <div className="bg-blue-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FolderKanban className="w-10 h-10 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No Projects Found
              </h2>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {data && data.length === 0
                  ? "You haven't created any projects yet. Start by creating your first project to begin collaborating with others."
                  : "No projects match your current filters. Try adjusting your search criteria."}
              </p>
              {data && data.length === 0 && (
                <button
                  onClick={redirectToCreateProject}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                  type="button"
                >
                  Create Your First Project
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
              {sortedProjects.map((project) => (
                <div
                  key={project._id}
                  className={`
                    bg-white rounded-xl shadow-sm border transition-all duration-200 w-full
                    ${
                      project.isEnabled
                        ? "border-gray-200"
                        : "border-gray-300 bg-gray-100 opacity-75"
                    }
                    hover:shadow-md hover:border-blue-200
                  `}
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {getStatusIcon(project.status)}
                        <span className="capitalize">
                          {project.status || "Open"}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMutation.mutate({
                            id: project._id,
                            isEnabled: project.isEnabled,
                          });
                        }}
                        className={`
                          p-1.5 rounded-lg transition-colors
                          ${
                            project.isEnabled
                              ? "text-green-600 hover:bg-green-50"
                              : "text-gray-400 hover:bg-gray-50"
                          }
                        `}
                        title={
                          project.isEnabled
                            ? "Project is active"
                            : "Project is inactive"
                        }
                        type="button"
                      >
                        {project.isEnabled ? (
                          <ToggleRight className="w-5 h-5" />
                        ) : (
                          <ToggleLeft className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                      {project.name}
                    </h2>

                    <p className="text-gray-600 mb-4 text-sm line-clamp-2 h-10">
                      {project.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Tag className="w-3.5 h-3.5 text-gray-500" />
                        <span className="truncate">
                          {project.technologies.join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Users className="w-3.5 h-3.5 text-gray-500" />
                        <span>
                          {project.applicants?.length || 0} Applicants
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        <span>
                          Created{" "}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                      {/* Start Project Button */}
                      {project.status === "Open" &&
                        project.selectedApplicants?.length > 0 && (
                          <button
                            onClick={() => handleStartProject(project._id)}
                            className="w-full mb-2.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5"
                            type="button"
                          >
                            <Play className="w-3.5 h-3.5" />
                            Start Project
                          </button>
                        )}

                      {/* Complete Project Button */}
                      {project.status !== "Completed" &&
                        project.status === "In_progress" && (
                          <button
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: project._id,
                                status: "Completed",
                              })
                            }
                            className="w-full mb-2.5 px-3 py-1.5 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-1.5"
                            type="button"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Mark as Complete
                          </button>
                        )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleProjectClick(project)}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
                          type="button"
                        >
                          <Users className="w-3.5 h-3.5" />
                          View Applicants
                        </button>
                        {confirmDelete === project._id ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMutation.mutate(project._id);
                            }}
                            className="px-3 py-2 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5"
                            type="button"
                          >
                            Confirm Delete
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDelete(project._id);
                            }}
                            className="px-3 py-2 border border-red-200 text-red-600 text-xs rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
                            type="button"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyProjectsPage;
