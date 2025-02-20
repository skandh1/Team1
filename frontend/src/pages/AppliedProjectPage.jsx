import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Loader, ClipboardList, CheckCircle2, Clock3 } from "lucide-react";

const AppliedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedProjects = async () => {
      try {
        const response = await axiosInstance.get("/appliedProjects/see");
        setProjects(response.data.appliedProjects);
      } catch (error) {
        console.error("Error fetching applied projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedProjects();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex flex-col items-center gap-4">
        <Loader className="animate-spin text-blue-600" size={48} />
        <p className="text-blue-600 font-medium">Loading your applications...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ClipboardList className="text-blue-600" size={32} />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Applied Projects
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track the status of your project applications
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl">
            <p className="text-gray-600 font-medium">You haven&#39;t applied to any projects yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:transform hover:scale-[1.01]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{project.name}</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">{project.description}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                    project.isSelected 
                      ? "bg-green-100 text-green-700" 
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {project.isSelected ? (
                      <>
                        <CheckCircle2 size={20} />
                        <span className="font-medium">Selected</span>
                      </>
                    ) : (
                      <>
                        <Clock3 size={20} />
                        <span className="font-medium">Pending</span>
                      </>
                    )}
                  </div>
                </div>

                {project.technologies && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedProjects;