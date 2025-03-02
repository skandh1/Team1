import { Briefcase, X } from "lucide-react";
import { useState, useEffect } from "react";

// Utility function for formatting dates
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};

const ExperienceSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [experiences, setExperiences] = useState(userData.experience || []);
	const [newExperience, setNewExperience] = useState({
		id: '',
		title: "",
		company: "",
		startDate: "",
		endDate: "",
		description: "",
		currentlyWorking: false,
	});

	// Update local state when userData changes
	useEffect(() => {
		if (userData.experience) {
			setExperiences([...userData.experience]);
		}
	}, [userData.experience]);

	const handleAddExperience = () => {
		if (newExperience.title && newExperience.company && newExperience.startDate) {
			const experienceWithId = {
				...newExperience,
				id: Date.now().toString(), // Generate a unique ID
			};
			const updatedExperiences = [...experiences, experienceWithId];
			setExperiences(updatedExperiences);

			setNewExperience({
				id: '',
				title: "",
				company: "",
				startDate: "",
				endDate: "",
				description: "",
				currentlyWorking: false,
			});
		}
	};

	const handleDeleteExperience = (idToDelete) => {
		// Create a new array with all experiences except the one with the matching ID
		const filteredExperiences = experiences.filter(exp => exp._id !== idToDelete);
		console.log("Deleting ID:", idToDelete);
		console.log("Before:", experiences);
		console.log("After:", filteredExperiences);
		setExperiences(filteredExperiences);
	};

	const handleSave = () => {
		onSave({ experience: experiences });
		setIsEditing(false);
	};

	const handleCurrentlyWorkingChange = (e) => {
		const isChecked = e.target.checked;
		setNewExperience({
			...newExperience,
			currentlyWorking: isChecked,
			endDate: isChecked ? "" : newExperience.endDate,
		});
	};

	return (
		<div className='bg-white shadow rounded-lg p-6 mb-6'>
			<h2 className='text-xl font-semibold mb-4'>Experience</h2>
			
			{experiences && experiences.length > 0 ? (
				<div className="space-y-4">
					{experiences.map((exp) => (
						<div key={exp._id} className='p-3 border rounded-lg'>
							<div className='flex justify-between items-start'>
								<div className='flex items-start'>
									<Briefcase size={20} className='mr-2 mt-1 text-gray-500' />
									<div>
										<h3 className='font-semibold'>{exp.title}</h3>
										<p className='text-gray-600'>{exp.company}</p>
										<p className='text-gray-500 text-sm'>
											{formatDate(exp.startDate)} - {exp.currentlyWorking ? "Present" : formatDate(exp.endDate)}
										</p>
										{exp.description && (
											<p className='text-gray-700 mt-1'>{exp.description}</p>
										)}
									</div>
								</div>
								{isEditing && (
									<button 
										onClick={() => handleDeleteExperience(exp._id)} 
										className='text-red-500 hover:bg-red-50 p-1 rounded-full'
										type="button"
									>
										<X size={18} />
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			) : (
				<p className="text-gray-400 italic mb-4">
					{isOwnProfile ? "Add your work experience to showcase your career path" : "No experience listed"}
				</p>
			)}

			{isEditing && (
				<div className='mt-6 p-4 border rounded-lg bg-gray-50'>
					<h3 className="font-medium mb-3">Add New Experience</h3>
					<div className="space-y-3">
						<div>
							<label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
								Job Title*
							</label>
							<input
								id="title"
								type='text'
								placeholder='e.g. Software Engineer'
								value={newExperience.title}
								onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
								className='w-full p-2 border rounded'
							/>
						</div>
						
						<div>
							<label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
								Company*
							</label>
							<input
								id="company"
								type='text'
								placeholder='e.g. Acme Inc.'
								value={newExperience.company}
								onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
								className='w-full p-2 border rounded'
							/>
						</div>
						
						<div>
							<label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
								Start Date*
							</label>
							<input
								id="startDate"
								type='date'
								value={newExperience.startDate}
								onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
								className='w-full p-2 border rounded'
							/>
						</div>
						
						<div className='flex items-center'>
							<input
								type='checkbox'
								id='currentlyWorking'
								checked={newExperience.currentlyWorking}
								onChange={handleCurrentlyWorkingChange}
								className='mr-2'
							/>
							<label htmlFor='currentlyWorking' className="text-sm">I currently work here</label>
						</div>
						
						{!newExperience.currentlyWorking && (
							<div>
								<label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
									End Date
								</label>
								<input
									id="endDate"
									type='date'
									value={newExperience.endDate}
									onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
									className='w-full p-2 border rounded'
								/>
							</div>
						)}
						
						<div>
							<label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
								Description
							</label>
							<textarea
								id="description"
								placeholder='Describe your responsibilities and achievements'
								value={newExperience.description}
								onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
								className='w-full p-2 border rounded'
								rows={3}
							/>
						</div>
						
						<button
							onClick={handleAddExperience}
							disabled={!newExperience.title || !newExperience.company || !newExperience.startDate}
							className='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 
							disabled:bg-gray-300 disabled:cursor-not-allowed'
							type="button"
						>
							Add Experience
						</button>
					</div>
				</div>
			)}

			{isOwnProfile && (
				<div className="mt-4">
					{isEditing ? (
						<div className="flex justify-end space-x-2">
							<button
								onClick={() => setIsEditing(false)}
								className='py-2 px-4 rounded border hover:bg-gray-100 transition duration-300'
								type="button"
							>
								Cancel
							</button>
							<button
								onClick={handleSave}
								className='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300'
								type="button"
							>
								Save Changes
							</button>
						</div>
					) : (
						<button
							onClick={() => setIsEditing(true)}
							className='text-blue-600 hover:text-blue-800 transition duration-300'
							type="button"
						>
							{experiences && experiences.length > 0 ? "Edit Experience" : "Add Experience"}
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default ExperienceSection;