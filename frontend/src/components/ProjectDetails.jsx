import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock3, 
  AlertCircle,
  XCircle
} from "lucide-react";
import ProjectProgress from "../components/ProjectProgress";
import toast from "react-hot-toast";

const ProjectDetails = ({ project, onLeaveProject, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!project) return null;

  const handleLeaveProject = async () => {
    if (!confirm("Are you sure you want to leave this project?")) return;
    
    try {
      setLoading(true);
      setError(null);
      await onLeaveProject(project._id);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to leave project");
      toast.error(err.response?.data?.message || "Failed to leave project");
      console.error("Error leaving project:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle size={24} />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 leading-relaxed mb-4">
              {project.description}
            </p>

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
          </div>

          {/* Project Progress Component */}
          <ProjectProgress project={project} />

          {/* Leave Project Button */}
          <div className="mt-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}
            
            <button
              onClick={handleLeaveProject}
              disabled={loading}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Clock3 size={18} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <XCircle size={18} />
                  <span>Leave Project</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;