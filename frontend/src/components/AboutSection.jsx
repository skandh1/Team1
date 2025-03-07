import { useState, useEffect } from "react";

const AboutSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [about, setAbout] = useState(userData.about || "");
	
	// Update local state when userData changes
	useEffect(() => {
		setAbout(userData.about || "");
	}, [userData.about]);

	const handleSave = () => {
		setIsEditing(false);
		onSave({ about });
	};

	return (
		<div className='bg-white shadow rounded-lg p-6 mb-6'>
			<h2 className='text-xl font-semibold mb-4'>About</h2>
			
			{isEditing ? (
				<>
					<textarea
						value={about}
						onChange={(e) => setAbout(e.target.value)}
						className='w-full p-2 border rounded'
						rows='4'
						placeholder="Tell others about yourself..."
					/>
					<div className="mt-2 flex justify-end space-x-2">
						<button
							onClick={() => setIsEditing(false)}
							className='py-2 px-4 rounded border hover:bg-gray-100 transition duration-300'
						>
							Cancel
						</button>
						<button
							onClick={handleSave}
							className='bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark 
							transition duration-300'
						>
							Save
						</button>
					</div>
				</>
			) : (
				<>
					<div className="min-h-[60px]">
						{about ? (
							<p className="whitespace-pre-wrap">{about}</p>
						) : (
							<p className="text-gray-400 italic">
								{isOwnProfile ? "Add information about yourself" : "No information provided"}
							</p>
						)}
					</div>
					
					{isOwnProfile && (
						<button
							onClick={() => setIsEditing(true)}
							className='mt-2 text-primary hover:text-primary-dark transition duration-300'
						>
							{about ? "Edit" : "Add About"}
						</button>
					)}
				</>
			)}
		</div>
	);
};

export default AboutSection;