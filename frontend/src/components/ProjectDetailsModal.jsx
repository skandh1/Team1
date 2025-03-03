import { Link } from "react-router-dom";
import { X, Users, Calendar, Code, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const ProjectDetailsModal = ({ project, onClose, user }) => {
  if (!project) return;

  const [createdBy, setCreatedBy] = useState("");
  console.log("projectid", project._id);
  useEffect(() => {
    axiosInstance
      .get(`/editproject/project/createdBy/${project._id}`)
      .then((res) => {
        setCreatedBy(res.data.createdBy);
        console.log(res.data.createdBy);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  console.log(createdBy);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 line-clamp-1">
            {project.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                About the Project
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Creator Info */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Project Creator
              </h3>
              <Link
                to={`/profile/${createdBy.username}`}
                className="flex items-center gap-3 group"
              >
                <img
                  src={
                    createdBy?.profilePicture ||
                    `https://ui-avatars.com/api/?name=${createdBy.name}`
                  }
                  alt={createdBy.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {createdBy.name}
                    </h4>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-500">@{createdBy.username}</p>
                </div>
              </Link>
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Team Size</span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {project.peopleRequired} People
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Timeline</span>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(project.startDate).toLocaleDateString()} -{" "}
                  {new Date(project.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Code className="w-4 h-4 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Required Technologies
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;
