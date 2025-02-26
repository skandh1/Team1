import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { Link } from "react-router-dom";
import { Search, UserPlus, Briefcase, MapPin, Users2, Loader2 } from "lucide-react";

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");

  const {
    data: searchResults,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["searchResults", query],
    queryFn: () =>
      query
        ? axiosInstance.get(`/search/user?query=${query}`).then((res) => res.data)
        : [],
    enabled: !!query,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(searchTerm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Search Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Find Amazing People
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with professionals, discover opportunities, and expand your network
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="relative mb-12">
          <div className="relative flex items-center max-w-2xl mx-auto">
            <Search className="absolute left-4 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, username, or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-shadow text-gray-900 placeholder-gray-400 bg-white shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <span>Search</span>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </button>
          </div>
        </form>

        {/* Search Results */}
        <div className="space-y-6">
          {isError && (
            <div className="text-center p-8 bg-red-50 rounded-2xl">
              <p className="text-red-600">An error occurred while fetching results. Please try again.</p>
            </div>
          )}

          {searchResults && searchResults.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {searchResults.map((user) => (
                <Link
                  to={`/profile/${user.username}`}
                  key={user._id}
                  className="block group"
                >
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg hover:border-indigo-100">
                    <div className="relative">
                      {user.bannerImg && (
                        <div className="h-24 rounded-xl overflow-hidden mb-4">
                          <img
                            src={user.bannerImg}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {user.name}
                          </h2>
                          <p className="text-gray-600">@{user.username}</p>
                        </div>
                        <button className="p-2 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                          <UserPlus className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {user.headline && (
                      <div className="flex items-center mt-4 text-gray-600">
                        <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                        <p className="text-sm line-clamp-1">{user.headline}</p>
                      </div>
                    )}

                    {user.location && (
                      <div className="flex items-center mt-2 text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <p className="text-sm">{user.location}</p>
                      </div>
                    )}

                    {user.bio && (
                      <p className="mt-4 text-gray-600 text-sm line-clamp-2">
                        {user.bio}
                      </p>
                    )}

                    <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
                      <Users2 className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">
                        {user.connections || 0} connections
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query && !isLoading ? (
            <div className="text-center py-12">
              <Users2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or browse our suggested connections below
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;