import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { Star, Briefcase, FolderPlus, MessageSquare, UserPlus, Check, Loader2 } from "lucide-react";
import ProfileHeader from "../components/ProfileHeader";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import SkillsSection from "../components/SkillsSection";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { username } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  const { mutate: addConnection } = useMutation({
    mutationFn: async (userId) => {
      await axiosInstance.post("/users/connections", { userId });
    },
    onSuccess: () => {
      toast.success("Connection added successfully");
      queryClient.invalidateQueries(["userProfile", username]);
    },
  });

  const handleChatClick = () => {
    if (!isConnected) {
      toast.error("You need to connect with this user first to send messages");
      return;
    }
    navigate("/chat", { state: { selectedUser: userProfile.data } });
  };

  const handleConnect = () => {
    if (userProfile?.data?._id) {
      addConnection(userProfile.data._id);
    }
  };

  if (isLoading || isUserProfileLoading || isMetricsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-blue-600">
            <Loader2 className="w-12 h-12 animate-spin" />
            <p className="text-lg font-medium">Loading messages...</p>
          </div>
        </div>
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

  const isConnected = authUser.connections?.includes(userData._id);

  const handleSave = (updatedData) => {
    updateProfile(updatedData);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="">
          <ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
          
          {!isOwnProfile && (
            <div className="flex gap-3 p-4 justify-center">
              {isConnected && (
                <button
                  onClick={handleChatClick}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Message</span>
                </button>
              )}
              
              {/* {!isConnected ? (
                <button
                  onClick={handleConnect}
                  className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-green-200"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Connect</span>
                </button>
              ) : (
                <button
                  disabled
                  className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl cursor-not-allowed"
                >
                  <Check className="w-5 h-5" />
                  <span>Connected</span>
                </button>
              )} */}
            </div>
          )}
        </div>
        
        {/* User Metrics Section */}
        <div className="border-t border-gray-100 px-8 py-6">
          <h2 className="text-xl font-semibold mb-6">Profile Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Average Rating */}
            <div className="flex items-center space-x-4 bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl transition-transform hover:scale-105">
              <div className="bg-white p-3 rounded-lg shadow-md">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Average Rating</p>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-blue-700">
                    {metrics.averageRating.toFixed(1)}
                  </span>
                  <span className="text-blue-600 ml-1">/5.0</span>
                </div>
              </div>
            </div>

            {/* Projects Participated */}
            <div className="flex items-center space-x-4 bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl transition-transform hover:scale-105">
              <div className="bg-white p-3 rounded-lg shadow-md">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">Projects Participated</p>
                <p className="text-2xl font-bold text-green-700">
                  {metrics.projectsParticipated}
                </p>
              </div>
            </div>

            {/* Projects Created */}
            <div className="flex items-center space-x-4 bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl transition-transform hover:scale-105">
              <div className="bg-white p-3 rounded-lg shadow-md">
                <FolderPlus className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-900">Projects Created</p>
                <p className="text-2xl font-bold text-purple-700">
                  {metrics.projectsCreated}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl transition-transform hover:scale-105">
              <div className="bg-white p-3 rounded-lg shadow-md">
                <FolderPlus className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-900">No Of Connections</p>
                <p className="text-2xl font-bold text-purple-700">
                  {metrics.NoOfConections}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <AboutSection 
          userData={userData} 
          isOwnProfile={isOwnProfile} 
          onSave={handleSave} 
        />
        <ExperienceSection 
          userData={userData} 
          isOwnProfile={isOwnProfile} 
          onSave={handleSave} 
        />
        
          <EducationSection 
            userData={userData} 
            isOwnProfile={isOwnProfile} 
            onSave={handleSave} 
          />
        
        <SkillsSection 
          userData={userData} 
          isOwnProfile={isOwnProfile} 
          onSave={handleSave} 
        />
      </div>
    </div>
  );
};

export default ProfilePage;