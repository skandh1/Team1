import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Code, ArrowLeftCircle, ArrowRightCircle, Loader } from "lucide-react";

const availableTechnologies = [
  "React", "Node.js", "Express", "MongoDB", "PostgreSQL",
  "Python", "Django", "Angular", "Vue.js", "Java", "Spring Boot"
];

function ProjectDisplayPage() {
  const [selectedTech, setSelectedTech] = useState([]);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["projects", selectedTech, page],
    queryFn: async () => {
      const response = await axiosInstance.get("/project", {
        params: {
          technologies: selectedTech.length > 0 ? selectedTech.join(",") : undefined,
          page: page,
        },
      });
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to fetch projects.");
    },
  });

  const handleTechnologySelect = (tech) => {
    setSelectedTech((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleApply = async (projectId) => {
    try {
      console.log("Applying to project", projectId);
      const response = await axiosInstance.post(`/project/apply/${projectId}`, { projectId });
      toast.success(response.data.message);
      refetch(); // Refresh project list after applying
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply.");
    }
  };

  if (isLoading) return <Loader className="animate-spin mx-auto text-blue-500" size={48} />;
  if (isError) return <p>Error loading projects.</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Projects</h1>

        {/* Filter Bar */}
        <div className="border rounded-lg p-3 bg-gray-50">
          <div className="flex items-center mb-2 text-gray-600">
            <Code size={20} className="mr-2" />
            <span>Select Technologies:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {availableTechnologies.map((tech) => (
              <button
                key={tech}
                onClick={() => handleTechnologySelect(tech)}
                className={`px-3 py-1 rounded-md text-sm transition-all ${
                  selectedTech.includes(tech)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        {/* Projects List */}
        <div className="projects-list space-y-4">
          {Array.isArray(data) && data.length > 0 ? (
            data.map((project) => (
              <div key={project._id} className="p-4 border rounded-lg bg-gray-50">
                <h2 className="text-xl font-semibold">{project.name}</h2>
                <p className="text-gray-600">{project.description}</p>
                <p className="mt-2 text-sm text-gray-500">
                  Technologies: {project.technologies?.join(", ")}
                </p>

                {/* Apply Button - Only show if user hasn't applied */}
                {!project.applicants.includes("user_id_here") && ( // Replace with actual user ID
                  <button
                    onClick={() => handleApply(project._id)}
                    className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Apply to Project
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No projects found.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className={`flex items-center ${
              page <= 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-500"
            }`}
          >
            <ArrowLeftCircle size={24} />
            <span className="ml-1">Previous</span>
          </button>
          <span>Page {page}</span>
          <button
            onClick={() => handlePageChange(page + 1)}
            className={`flex items-center text-blue-500`}
          >
            <span className="mr-1">Next</span>
            <ArrowRightCircle size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectDisplayPage;
