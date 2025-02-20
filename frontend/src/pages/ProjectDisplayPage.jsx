import { useState, useEffect } from "react";
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
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axiosInstance.get("/auth/me"); // **REPLACE with your actual endpoint**
        setUserId(response.data._id); // Adjust if your user ID is not under `_id`
      } catch (error) {
        console.error("Error fetching user ID:", error);
        // Handle error: redirect, show message, etc.
      }
    };
    fetchUserId();
  }, []);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["projects", selectedTech, page],
    queryFn: async () => {
      const response = await axiosInstance.get("/project", {
        params: {
          technologies: selectedTech.length > 0 ? selectedTech.join(",") : undefined,
          page: page,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        const populatedProjects = response.data.map(project => ({
          ...project,
          applicants: project.applicants || [], // Important: Handle potentially missing applicants
        }));
        return populatedProjects;
      }
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
    setPage(1); // Reset page when filtering
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleApply = async (projectId) => {
    try {
      const response = await axiosInstance.post(`/project/apply/${projectId}`);
      toast.success(response.data.message);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply.");
    }
  };

  if (isLoading || !userId) return <Loader className="animate-spin mx-auto text-blue-500" size={48} />;
  if (isError) return <p>Error loading projects.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-3xl p-8 space-y-8 transition-transform duration-300 hover:scale-105">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Projects</h1>

        {/* Filter Bar */}
        <div className="border rounded-xl p-4 bg-gray-50 shadow-inner">
          <div className="flex items-center mb-4 text-gray-700 font-medium">
            <Code size={20} className="mr-2 text-blue-500" />
            <span>Select Technologies:</span>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {availableTechnologies.map((tech) => (
              <button
                key={tech}
                onClick={() => handleTechnologySelect(tech)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedTech.includes(tech)
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-sm"
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {data && data.length > 0 ? ( // Check if data exists and has length
            data.map((project) => (
              <div key={project._id} className="p-6 border rounded-2xl bg-gray-50 shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-[1.02]">
                <h2 className="text-2xl font-semibold text-blue-600 mb-2">{project.name}</h2>
                <p className="text-gray-700 leading-relaxed">{project.description}</p>
                <p className="mt-3 text-sm text-gray-500">
                  Technologies: {project.technologies?.join(", ")}
                </p>

                {!project.applicants?.includes(userId) && userId && ( // Correct conditional check
                  <button
                    onClick={() => handleApply(project._id)}
                    className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Apply to Project
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No projects found.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className={`flex items-center ${
              page <= 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-700 transition-colors duration-200"
            }`}
          >
            <ArrowLeftCircle size={24} />
            <span className="ml-2">Previous</span>
          </button>
          <span className="text-gray-700 font-medium">Page {page}</span>
          <button
            onClick={() => handlePageChange(page + 1)}
            className={`flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200`}
          >
            <span className="mr-2">Next</span>
            <ArrowRightCircle size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectDisplayPage;