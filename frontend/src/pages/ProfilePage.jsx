import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { Star, Briefcase, FolderPlus } from "lucide-react";

import ProfileHeader from "../components/ProfileHeader";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import SkillsSection from "../components/SkillsSection";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { username } = useParams();
  const queryClient = useQueryClient();

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
  });

  const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => axiosInstance.get(`/users/${username}`),
  });

  const { data: userMetrics, isLoading: isMetricsLoading } = useQuery({
    queryKey: ["userMetrics", username],
    queryFn: () => axiosInstance.get(`/users/${username}/metrics`),
  });

  const { mutate: updateProfile } = useMutation({
    mutationFn: async (updatedData) => {
      await axiosInstance.put("/users/profile", updatedData);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries(["userProfile", username]);
    },
  });

  if (isLoading || isUserProfileLoading || isMetricsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isOwnProfile = authUser.username === userProfile.data.username;
  const userData = isOwnProfile ? authUser : userProfile.data;
  const metrics = userMetrics?.data || {
    averageRating: 0,
    projectsParticipated: 0,
    projectsCreated: 0,
  };

  const handleSave = (updatedData) => {
    updateProfile(updatedData);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
      
      {/* User Metrics Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Profile Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Average Rating */}
          <div className="flex items-center space-x-4 bg-blue-50 p-4 rounded-lg">
            <div className="bg-blue-100 p-3 rounded-full">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-600">
                  {metrics.averageRating.toFixed(1)}
                </span>
                <span className="text-gray-500 ml-1">/5.0</span>
              </div>
            </div>
          </div>

          {/* Projects Participated */}
          <div className="flex items-center space-x-4 bg-green-50 p-4 rounded-lg">
            <div className="bg-green-100 p-3 rounded-full">
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Projects Participated</p>
              <p className="text-2xl font-bold text-green-600">
                {metrics.projectsParticipated}
              </p>
            </div>
          </div>

          {/* Projects Created */}
          <div className="flex items-center space-x-4 bg-purple-50 p-4 rounded-lg">
            <div className="bg-purple-100 p-3 rounded-full">
              <FolderPlus className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Projects Created</p>
              <p className="text-2xl font-bold text-purple-600">
                {metrics.projectsCreated}
              </p>
            </div>
          </div>
        </div>
      </div>

      <AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
      <ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
      <EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
      <SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
    </div>
  );
};

export default ProfilePage;