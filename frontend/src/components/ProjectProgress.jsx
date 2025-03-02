import React from "react";
import { 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock3, 
  BarChart3,
  AlertCircle
} from "lucide-react";

const ProjectProgress = ({ project }) => {
  if (!project) return null;

  // Calculate progress percentage based on dates
  const calculateProgress = () => {
    const now = new Date();
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    
    // If project hasn't started yet
    if (now < start) return 0;
    
    // If project is completed
    if (now > end) return 100;
    
    // Calculate progress percentage
    const totalDuration = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / totalDuration) * 100);
  };

  const progress = calculateProgress();
  
  // Determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Open": return "text-blue-600 bg-blue-100";
      case "In Progress": return "text-amber-600 bg-amber-100";
      case "Completed": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };
  
  const statusClass = getStatusColor(project.status);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Project Progress</h3>
      
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">{progress}% Complete</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
            {project.status}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Project details */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} />
          <span>
            {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={16} />
          <span>
            {project.selectedApplicants?.length || 0} of {project.peopleRequired} team members
          </span>
        </div>
        
        {project.isSelected ? (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 size={16} />
            <span>You are selected for this project</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-amber-600">
            <Clock3 size={16} />
            <span>Application pending</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectProgress;