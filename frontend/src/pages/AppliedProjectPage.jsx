import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { 
  Loader, 
  ClipboardList, 
  CheckCircle2, 
  Clock3,
  XCircle,
  BarChart3,
  Calendar,
  RefreshCcw
} from "lucide-react";

const AppliedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppliedProjects = async () => {
    try {
      setRefreshing(true);
      const response = await axiosInstance.get("/appliedProjects/see");
      setProjects(response.data.appliedProjects);
    } catch (error) {
      console.error("Error fetching applied projects:", error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedProjects();
  }, []);

  const stats = {
    total: projects.length,
    selected: projects.filter(p => p.isSelected).length,
    pending: projects.filter(p => !p.isSelected).length
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex flex-col items-center gap-4">
        <Loader className="animate-spin text-blue-600" size={48} />
        <p className="text-blue-600 font-medium">Loading your applications...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ClipboardList className="text-blue-600" size={32} />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              My Applications
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Track and manage your project applications in one place
          </p>

          {/* Stats Cards */}
          {projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-center gap-3 text-blue-600 mb-2">
                  <BarChart3 size={24} />
                  <span className="text-2xl font-bold">{stats.total}</span>
                </div>
                <p className="text-gray-600 font-medium">Total Applications</p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-center gap-3 text-green-600 mb-2">
                  <CheckCircle2 size={24} />
                  <span className="text-2xl font-bold">{stats.selected}</span>
                </div>
                <p className="text-gray-600 font-medium">Selected</p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-center gap-3 text-amber-600 mb-2">
                  <Clock3 size={24} />
                  <span className="text-2xl font-bold">{stats.pending}</span>
                </div>
                <p className="text-gray-600 font-medium">Pending</p>
              </div>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={fetchAppliedProjects}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
          >
            <RefreshCcw size={18} className={refreshing ? "animate-spin" : ""} />
            <span className="font-medium">Refresh</span>
          </button>
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center shadow-xl">
            <XCircle size={48} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Applications Yet</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              You haven't applied to any projects yet. Start exploring available projects and submit your applications!
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h2 className="text-xl font-bold text-gray-900">{project.name}</h2>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        project.isSelected 
                          ? "bg-green-100 text-green-700" 
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {project.isSelected ? (
                          <>
                            <CheckCircle2 size={16} />
                            <span>Selected</span>
                          </>
                        ) : (
                          <>
                            <Clock3 size={16} />
                            <span>Pending</span>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">{project.description}</p>
                    
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={16} />
                      <span>Applied on {new Date(project.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedProjects;