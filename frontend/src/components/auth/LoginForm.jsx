import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.js";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";

const LoginForm = ({ onForgotPassword }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: loginMutation, isLoading } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/login", data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`Welcome back ${data.user.name}`);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Invalid credentials");
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation({ username, password });
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      {/* Username Input */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
        required
      />

      {/* Password Input with Eye Icon */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          required
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
        >
          {showPassword ? (
            // Eye icon for "visible"
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.667A10.725 10.725 0 0112 5.25c3.364 0 6.66 1.65 8.784 4.417m-16.796 0l4.704 4.704m0-16.596l-4.704 4.704m0 0A7.125 7.125 0 0112 4.875c-3.315 0-6.352 2.037-7.632 5.417m7.632 0A7.125 7.125 0 0012 19.125c3.315 0 6.352-2.037 7.632-5.417"
              />
            </svg>
          ) : (
            // Eye-slash icon for "hidden"
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5c-4.252 0-8.164 2.238-10.252 5.625C3.836 13.262 7.748 15.5 12 15.5c4.252 0 8.164-2.238 10.252-5.625C20.164 6.738 16.252 4.5 12 4.5zm0 0V4.5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3m-3-3h6"
              />
            </svg>
          )}
        </span>
      </div>

      {/* Forgot Password */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          Forgot password?
        </button>
      </div>

      {/* Sign In Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? (
          <Loader className="size-5 animate-spin mx-auto" />
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
