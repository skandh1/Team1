import React from "react";
import { Calendar, Users, CheckCircle2, Clock3 } from "lucide-react";

const ProjectProgress = ({ project, isParticipant }) => {
  // If user is not a participant, don't show progress
  if (!isParticipant) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Progress</h3>
      
      {/* Project Timeline */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <Calendar size={18} />
          <span className="font-medium">Timeline</span>
        </div>
        <div className="ml-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-700">Start Date:</span>
            <span className="text-sm text-gray-600">
              {project.startDate 
                ? new Date(project.startDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Not specified"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">End Date:</span>
            <span className="text-sm text-gray-600">
              {project.endDate 
                ? new Date(project.endDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Not specified"}
            </span>
          </div>
        </div>
      </div>
      
      {/* Project Team */}
      <div>
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <Users size={18} />
          <span className="font-medium">Team Members</span>
        </div>
        <div className="ml-6">
          {project.team && project.team.length > 0 ? (
            <ul className="space-y-2">
              {project.team.map((member, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role || "Team Member"}</p>
                  </div>
                  {member.isOwner && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      Owner
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No team members yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectProgress;