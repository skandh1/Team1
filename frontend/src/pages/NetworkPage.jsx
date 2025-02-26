import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import { UserPlus, Users, Loader } from "lucide-react";
import FriendRequest from "../components/FriendRequest";
import UserCard from "../components/UserCard";

const LoadingState = () => (
  <div className="flex items-center justify-center p-8">
    <Loader className="w-8 h-8 animate-spin text-blue-500" />
  </div>
);

const EmptyState = ({ icon: Icon, title, description, subDescription }) => (
  <div className="bg-white rounded-xl shadow-sm p-8 text-center mb-6 transform transition-all duration-300 hover:shadow-md">
    <Icon size={48} className="mx-auto text-gray-400 mb-4 animate-bounce" />
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
    {subDescription && (
      <p className="text-gray-600 mt-2">{subDescription}</p>
    )}
  </div>
);

const SectionTitle = ({ children }) => (
  <div className="flex items-center gap-2 mb-4">
    <h2 className="text-xl font-semibold text-gray-800">{children}</h2>
    <div className="flex-1 h-px bg-gray-200" />
  </div>
);

const NetworkPage = () => {
  const { data: user, isLoading: isLoadingUser } = useQuery({ 
    queryKey: ["authUser"],
  });

  const { 
    data: connectionRequests, 
    isLoading: isLoadingRequests 
  } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: () => axiosInstance.get("/connections/requests"),
  });

  const { 
    data: connections, 
    isLoading: isLoadingConnections 
  } = useQuery({
    queryKey: ["connections"],
    queryFn: () => axiosInstance.get("/connections"),
  });

  if (isLoadingUser) {
    return <LoadingState />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fadeIn">
      <div className="col-span-1 lg:col-span-1">
        <Sidebar user={user} />
      </div>
      
      <div className="col-span-1 lg:col-span-3 space-y-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Users size={24} className="text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-800">My Network</h1>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Connection Requests Section */}
            <section>
              <SectionTitle>Connection Requests</SectionTitle>
              
              {isLoadingRequests ? (
                <LoadingState />
              ) : connectionRequests?.data?.length > 0 ? (
                <div className="space-y-4">
                  {connectionRequests.data.map((request, index) => (
                    <div
                      key={request.id}
                      className="transform transition-all duration-300 hover:translate-x-2"
                      style={{ 
                        animationDelay: `${index * 100}ms`,
                        animation: 'slideIn 0.5s ease-out forwards'
                      }}
                    >
                      <FriendRequest request={request} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={UserPlus}
                  title="No Connection Requests"
                  description="You don't have any pending connection requests at the moment."
                  subDescription="Explore suggested connections below to expand your network!"
                />
              )}
            </section>

            {/* Connections Section */}
            <section>
              <SectionTitle>My Connections</SectionTitle>
              
              {isLoadingConnections ? (
                <LoadingState />
              ) : connections?.data?.length > 0 ? (
                <div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  style={{ animation: 'fadeIn 0.5s ease-out' }}
                >
                  {connections.data.map((connection, index) => (
                    <div
                      key={connection._id}
                      className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                      style={{ 
                        animationDelay: `${index * 100}ms`,
                        animation: 'slideUp 0.5s ease-out forwards'
                      }}
                    >
                      <UserCard user={connection} isConnection={true} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Users}
                  title="No Connections Yet"
                  description="Start building your professional network!"
                  subDescription="Connect with colleagues and professionals in your field."
                />
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkPage;