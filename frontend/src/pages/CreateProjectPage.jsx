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
} from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Create a New Project</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative border rounded-lg p-3 flex items-center bg-gray-50">
            <FilePlus size={20} className="mr-2 text-gray-500" />
            <input
              type="text"
              name="name"
              placeholder="Project Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none"
              required
            />
          </div>

          <div className="border rounded-lg p-3 bg-gray-50">
            <div className="flex items-center mb-2 text-gray-600">
              <Code size={20} className="mr-2" />
              <span>Select Technologies:</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {availableTechnologies.map((tech) => (
                <button
                  type="button"
                  key={tech}
                  onClick={() => handleTechnologySelect(tech)}
                  className={`px-3 py-1 rounded-md text-sm transition-all ${
                    formData.technologies.includes(tech)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          <textarea
            name="description"
            placeholder="Project Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none"
            required
          ></textarea>

          <div className="relative border rounded-lg p-3 flex items-center bg-gray-50">
            <Users size={20} className="mr-2 text-gray-500" />
            <input
              type="text"
              name="timeframe"
              placeholder="Project Timeframe (e.g., 2 weeks)"
              value={formData.timeframe}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none"
              required
            />
          </div>

          <div className="relative border rounded-lg p-3 flex items-center bg-gray-50">
            <Calendar size={20} className="mr-2 text-gray-500" />
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none"
              required
            />
          </div>

          <div className="relative border rounded-lg p-3 flex items-center bg-gray-50">
            <DollarSign size={20} className="mr-2 text-gray-500" />
            <input
              type="number"
              name="budget"
              placeholder="Project Budget (Optional)"
              value={formData.budget}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center"
            disabled={isPending}
          >
            {isPending ? (
              <Loader className="size-5 animate-spin" />
            ) : (
              "Create Project"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectPage;
