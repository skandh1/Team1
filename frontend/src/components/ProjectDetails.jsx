import React, { useState } from "react";
import { 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock3, 
  AlertCircle,
  XCircle
} from "lucide-react";
import ProjectProgress from "./ProjectProgress";
import toast from "react-hot-toast";

const ProjectDetails = ({ project, onLeaveProject, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!project) return null;

  // Determine if user is a participant or just an applicant
  const isParticipant = project.isSelected;

  const handleLeaveProject = async () => {
    const confirmMessage = isParticipant 
      ? "You cannot leave a project once you've been selected. Do you want to contact the project owner instead?"
      : "Are you sure you want to withdraw your application from this project?";
    
    if (!confirm(confirmMessage)) return;
    
    // If user is a participant, we don't allow leaving
    if (isParticipant) {
      // Here you could implement a way to contact the project owner
      toast.error("You cannot leave a project once you've been selected. Please contact the project owner.");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      await onLeaveProject(project._id);
      toast.success("Successfully withdrawn from the project");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to withdraw from project");
      toast.error(err.response?.data?.message || "Failed to withdraw from project");
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
            
            {/* Application Status */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  isParticipant
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {isParticipant ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Selected - You are part of this project</span>
                  </>
                ) : (
                  <>
                    <Clock3 size={16} />
                    <span>Pending - Application under review</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Project Progress Component - Only shown to participants */}
          <ProjectProgress project={project} isParticipant={isParticipant} />

          {/* Leave/Withdraw Button - Different text based on status */}
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
              className={`w-full py-3 px-4 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                isParticipant 
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300" 
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {loading ? (
                <>
                  <Clock3 size={18} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <XCircle size={18} />
                  <span>{isParticipant ? "Cannot Leave Project" : "Withdraw Application"}</span>
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