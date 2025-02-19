import  { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

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

  if (loading) return <p>Loading projects...</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Applied Projects</h2>
      {projects.length === 0 ? (
        <p>No applied projects.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project._id} className="border p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <p className="text-gray-600">{project.description}</p>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
                    project.isSelected ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {project.isSelected ? "✅ Selected" : "⏳ Pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedProjects;
