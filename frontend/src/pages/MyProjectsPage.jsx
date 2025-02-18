import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Trash, ToggleLeft, ToggleRight, Loader } from "lucide-react";
import ProjectApplicantsModal from "../components/ProjectApplicantsModal";

function MyProjectsPage() {
  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState(null);

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
    },
    onError: () => toast.error("Failed to delete project"),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isEnabled }) => axiosInstance.patch(`/editProject/${id}`, { isEnabled: !isEnabled }),
    onSuccess: () => {
      toast.success("Project updated");
      queryClient.invalidateQueries(["myProjects"]);
    },
    onError: () => toast.error("Failed to update project"),
  });

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };
  

  if (isLoading) return <Loader className="animate-spin mx-auto text-blue-500" size={48} />;
  if (isError) return <p>Error loading projects.</p>;

  return (
    selectedProject ? (
      <ProjectApplicantsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelect={(applicantId) => console.log("Selected applicant:", applicantId)}
      />
    ) : (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8 space-y-6">
          <h1 className="text-2xl font-bold text-center">My Projects</h1>
  
          {data.length === 0 ? (
            <p className="text-gray-500 text-center">You have no projects.</p>
          ) : (
            <div className="space-y-4">
              {data.map((project) => (
                <div key={project._id} onClick={() => handleProjectClick(project)} className="p-4 border rounded-lg bg-gray-50">
                  <h2 className="text-xl font-semibold">{project.name}</h2>
                  <p className="text-gray-600">{project.description}</p>
                  <p className="text-sm text-gray-500">Technologies: {project.technologies.join(", ")}</p>
                  <div className="flex justify-between items-center mt-3">
                    <button
                      onClick={() => toggleMutation.mutate({ id: project._id, isEnabled: project.isEnabled })}
                      className="text-blue-500 flex items-center"
                    >
                      {project.isEnabled ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}{" "}
                      <span className="ml-1">{project.isEnabled ? "Disable" : "Enable"}</span>
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(project._id)}
                      className="text-red-500 flex items-center"
                    >
                      <Trash size={20} /> <span className="ml-1">Delete</span>
                    </button>
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
