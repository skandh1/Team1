import { X, CheckCircle } from "lucide-react";

const ProjectApplicantsModal = ({ project, onClose, onSelect }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Applicants for {project.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={24} />
          </button>
        </div>
        <ul className="border p-2 rounded-md mt-2">
          {project.applicants.length > 0 ? (
            project.applicants.map((applicant) => (
              <li key={applicant._id} className="flex justify-between items-center text-gray-700 p-1">
                <span>{applicant.name} ({applicant.email})</span>
                <button
                  onClick={() => onSelect(applicant._id)}
                  className="text-green-500 hover:text-green-700"
                >
                  <CheckCircle size={20} />
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No applicants yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProjectApplicantsModal;
