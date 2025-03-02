import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {
  Code,
  ArrowLeftCircle,
  ArrowRightCircle,
  Loader,
  Sparkles,
  Info,
  Users,
  Search,
  SlidersHorizontal,
  Calendar,
  Loader2,
} from "lucide-react";
import ProjectDetailsModal from "../components/ProjectDetailsModal";

const availableTechnologies = [
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "Python",
  "Django",
  "Angular",
  "Vue.js",
  "Java",
  "Spring Boot",
];

const sortOptions = [
  { value: "recent", label: "Most Recent", icon: Calendar },
  { value: "oldest", label: "Oldest First", icon: Calendar },
  { value: "applicants", label: "Most Applicants", icon: Users },
];

function ProjectDisplayPage() {
  const [selectedTech, setSelectedTech] = useState([]);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState(``);
  const [userId, setUserId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        setUser(response.data);
        setUserId(response.data._id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["projects", selectedTech, page, searchQuery, sortBy],
    queryFn: async () => {
      const response = await axiosInstance.get("/project", {
        params: {
          technologies:
            selectedTech.length > 0 ? selectedTech.join(",") : undefined,
          page,
          search: searchQuery,
          sortBy,
        },
      });

      if (response.data && Array.isArray(response.data.projects)) {
        return response.data.projects.map((project) => ({
          ...project,
          applicants: project.applicants || [],
        }));
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

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    if (timeoutId) clearTimeout(timeoutId);

    const newTimeoutId = setTimeout(() => {
      setSearchQuery(newValue.trim());
      setPage(1);
    }, 500);

    setTimeoutId(newTimeoutId);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(inputValue.trim());
    setPage(1);
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

  if (isLoading || !userId)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-blue-600">
            <Loader2 className="w-12 h-12 animate-spin" />
            <p className="text-lg font-medium">Loading messages...</p>
          </div>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-red-600">Error loading projects</p>
      </div>
    );

  return (
    <>
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          user={user}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="text-blue-600" size={28} />
            <h1 className="text-2xl font-bold text-gray-900">
              Discover Projects
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 rounded-lg border transition-all ${
                showFilters
                  ? "bg-blue-50 border-blue-200 text-blue-600"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </form>

          {showFilters && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Code className="text-blue-600" size={20} />
                <h2 className="font-medium text-gray-700">Technologies</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTechnologies.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => handleTechnologySelect(tech)}
                    className={`${
                      selectedTech.includes(tech)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    } px-3 py-1.5 rounded-lg text-sm font-medium transition-colors`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Filters */}
          {(selectedTech.length > 0 || searchQuery) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              {selectedTech.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-1"
                >
                  {tech}
                  <button
                    onClick={() => handleTechnologySelect(tech)}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
              {searchQuery && (
                <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium flex items-center gap-1">
                  Search: {searchQuery}
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setInputValue("");
                    }}
                    className="hover:text-purple-900"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Projects Grid */}
        <div className="grid gap-4">
          {data && data.length > 0 ? (
            data.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 truncate">
                      {project.name}
                    </h2>
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies?.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>
                          {project.applicants?.length || 0} applicants
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                      title="View Details"
                    >
                      <Info size={20} />
                    </button>

                    {!project.applicants?.includes(userId) && userId && (
                      <button
                        onClick={() => handleApply(project._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-white rounded-xl">
              <p className="text-gray-600">
                No projects found matching your criteria.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 bg-white rounded-xl p-3 shadow-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
              page <= 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:bg-blue-50"
            }`}
          >
            <ArrowLeftCircle size={18} />
            <span className="text-sm font-medium">Previous</span>
          </button>

          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
            Page {page}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <span className="text-sm font-medium">Next</span>
            <ArrowRightCircle size={18} />
          </button>
        </div>
      </div>
    </>
  );
}

export default ProjectDisplayPage;
