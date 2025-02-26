import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import { Users, Sparkles } from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";

const HomePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/suggestions");
      return res.data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts");
      return res.data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-10xl mx-auto">
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-shadow hover:shadow-md">
              <PostCreation user={authUser} />
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts?.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
                  >
                    <Post post={post} />
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="mb-6 relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Sparkles className="h-8 w-8 text-purple-500 animate-pulse" />
                    </div>
                    <Users size={64} className="mx-auto text-indigo-500 opacity-90" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Start Your Journey
                  </h2>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Your feed is waiting to be filled with amazing connections and inspiring content. Start exploring!
                  </p>
                  <button className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity">
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
              {recommendedUsers?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Suggested Connections</h2>
                    <Sparkles className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="space-y-4">
                    {recommendedUsers.map((user) => (
                      <div
                        key={user._id}
                        className="p-3 rounded-xl transition-colors hover:bg-gray-50"
                      >
                        <RecommendedUser user={user} />
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 w-full py-2.5 px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    View More
                  </button>
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