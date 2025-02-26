import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {
  Calendar,
  Code,
  Users,
  FilePlus,
  Loader,
  DollarSign,
  Sparkles,
  FileText,
} from "lucide-react";

const availableTechnologies = [
  "React", "Node.js", "Express", "MongoDB", "PostgreSQL",
  "Python", "Django", "Angular", "Vue.js", "Java", "Spring Boot",
];

function CreateProjectPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    technologies: [],
    timeframe: "",
    deadline: "",
    budget: 0,
  });

  const { mutate: createProjectMutation, isPending } = useMutation({
    mutationFn: async (newProject) => {
      return await axiosInstance.post("/project", newProject, {
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      resetForm();
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTechnologySelect = (tech) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter((t) => t !== tech)
        : [...prev.technologies, tech],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createProjectMutation(formData);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      technologies: [],
      timeframe: "",
      deadline: "",
      budget: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-blue-600" size={32} />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Create New Project
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Share your vision and find the perfect team for your project
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl space-y-6">
          {/* Project Name */}
          <div className="group relative transition-all duration-300">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FilePlus className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Project Name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Project Description */}
          <div className="group relative transition-all duration-300">
            <div className="absolute left-3 top-3">
              <FileText className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <textarea
              name="description"
              placeholder="Project Description"
              value={formData.description}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all min-h-[120px] resize-y"
              required
            />
          </div>

          {/* Technologies */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Code className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Technologies</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {availableTechnologies.map((tech) => (
                <button
                  type="button"
                  key={tech}
                  onClick={() => handleTechnologySelect(tech)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    formData.technologies.includes(tech)
                      ? "bg-blue-500 text-white shadow-md hover:bg-blue-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group relative transition-all duration-300">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                name="timeframe"
                placeholder="Timeframe (e.g., 2 weeks)"
                value={formData.timeframe}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div className="group relative transition-all duration-300">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div className="group relative transition-all duration-300 md:col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="number"
                name="budget"
                placeholder="Project Budget (Optional)"
                value={formData.budget}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Creating Project...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Create Project</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectPage;