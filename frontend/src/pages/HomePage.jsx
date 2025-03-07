import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import { Users, Sparkles } from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";

const HomePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: recommendedUsers, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/suggestions");
      return res.data;
    },
  });

  const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts");
      return res.data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-8xl mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Hidden on mobile, shown on lg screens */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-6">
              <Sidebar user={authUser} />
            </div>
          </div>

          {/* Main Content */}
          <main className="col-span-12 lg:col-span-6 space-y-6">
            {/* Post Creation Card */}
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 transition-shadow hover:shadow-lg">
              <PostCreation user={authUser} />
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {isLoadingPosts ? (
                // Loading state for posts
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md border border-gray-100 p-6 animate-pulse">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="h-40 bg-gray-200 rounded mt-4"></div>
                  </div>
                ))
              ) : posts?.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
                  >
                    <Post post={post} />
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-md border border-gray-100 p-8 text-center">
                  <div className="mb-6 relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Sparkles className="h-8 w-8 text-primary-500 animate-pulse" />
                    </div>
                    <Users size={64} className="mx-auto text-primary-600 opacity-90" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-primary-600">
                    Start Your Journey
                  </h2>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Your feed is waiting to be filled with amazing connections and inspiring content. Start exploring!
                  </p>
                  <button className="inline-flex items-center px-6 py-3 rounded-md bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    Discover People
                    <Users className="ml-2 h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </main>

          {/* Recommended Users - Hidden on mobile, shown on lg screens */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-6">
              {isLoadingUsers ? (
                // Loading state for recommended users
                <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 animate-pulse">
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                  </div>
                  {Array(3).fill(0).map((_, index) => (
                    <div key={index} className="flex items-center space-x-3 mb-4 p-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recommendedUsers?.length > 0 && (
                <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Suggested Connections</h2>
                    <Sparkles className="h-5 w-5 text-primary-500" />
                  </div>
                  <div className="space-y-4">
                    {recommendedUsers.map((user) => (
                      <div
                        key={user._id}
                        className="p-3 rounded-md transition-colors hover:bg-gray-50"
                      >
                        <RecommendedUser user={user} />
                      </div>
                    ))}
                  </div>
                  {/* <button className="mt-4 w-full py-2.5 px-4 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    View More
                  </button> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;