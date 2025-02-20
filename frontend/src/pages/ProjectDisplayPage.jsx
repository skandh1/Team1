import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Code, ArrowLeftCircle, ArrowRightCircle, Loader, Sparkles } from "lucide-react";

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
        const response = await axiosInstance.get("/auth/me");
        setUserId(response.data._id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
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
          applicants: project.applicants || [],
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
    setPage(1);
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

  if (isLoading || !userId) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex flex-col items-center gap-4">
        <Loader className="animate-spin text-blue-600" size={48} />
        <p className="text-blue-600 font-medium">Loading amazing projects...</p>
      </div>
    </div>
  );
  
  if (isError) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
      <p className="text-red-600 font-medium">Error loading projects.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-blue-600" size={32} />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Discover Projects
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find exciting projects that match your skills and interests
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Code className="text-blue-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">Technologies</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {availableTechnologies.map((tech) => (
              <button
                key={tech}
                onClick={() => handleTechnologySelect(tech)}
                className={`${
                  selectedTech.includes(tech)
                    ? "bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                } px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6">
          {data && data.length > 0 ? (
            data.map((project) => (
              <div
                key={project._id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:transform hover:scale-[1.01]"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{project.name}</h2>
                <p className="text-gray-600 leading-relaxed mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies?.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {!project.applicants?.includes(userId) && userId && (
                  <button
                    onClick={() => handleApply(project._id)}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Apply for Project
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl">
              <p className="text-gray-600 font-medium">No projects found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors duration-200 ${
              page <= 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:bg-blue-50"
            }`}
          >
            <ArrowLeftCircle size={20} />
            <span className="font-medium">Previous</span>
          </button>
          
          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-medium">
            Page {page}
          </span>
          
          <button
            onClick={() => handlePageChange(page + 1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors duration-200"
          >
            <span className="font-medium">Next</span>
            <ArrowRightCircle size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectDisplayPage;