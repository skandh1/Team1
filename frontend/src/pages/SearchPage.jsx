import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { Link } from "react-router-dom";

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
        ? axiosInstance.get(`/search/user?q=${query}`).then((res) => res.data)
        : [],
    enabled: !!query, // Only fetch if query is not empty
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(searchTerm);
  };
  console.log(searchResults);
  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Search Users</h1>

      <form onSubmit={handleSearch} className="flex w-full max-w-md gap-2">
        <input
          type="text"
          placeholder="Search by username or name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Search
        </button>
      </form>

      <div className="w-full max-w-md mt-6">
        {isLoading && <p className="text-gray-600">Loading...</p>}
        {isError && <p className="text-red-500">Error fetching results.</p>}

        {searchResults && searchResults.length > 0
          ? searchResults.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                key={user._id}
                className="block text-blue-500 hover:text-blue-600"
              >
                <div
                  key={user._id}
                  className="mb-4 p-4 border border-gray-300 rounded-lg bg-white"
                >
                  <img src={user.bannerImg} alt="" />
                  <h2 className="text-lg font-bold">{user.name}</h2>
                  <p className="text-gray-800">@{user.username}</p>
                  <p className="text-gray-500">{user.headline}</p>
                  {user.bio && <p className="text-gray-500 mt-2">{user.bio}</p>}
                </div>
              </Link>
            ))
          : query &&
            !isLoading && <p className="text-gray-500">No results found.</p>}
      </div>
    </div>
  );
};

export default SearchComponent;
