import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.js";
import { toast } from "react-hot-toast";
import { Loader, Eye, EyeOff } from "lucide-react";

const SECURITY_QUESTIONS = [
  "What was your first pet's name?",
  "In what city were you born?",
  "What is your mother's maiden name?",
  "What was your childhood nickname?",
  "What was the name of your first school?"
];

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState(SECURITY_QUESTIONS[0]);
  const [securityAnswer, setSecurityAnswer] = useState("");

  const queryClient = useQueryClient();

  const { mutate: signUpMutation, isLoading } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/signup", data);
      toast.success(`Logged in successfully, Welcome ${name}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Something went wrong");
    },
  });

  const handleSignUp = (e) => {
    e.preventDefault();
    signUpMutation({
      name,
      username,
      email,
      password,
      securityQuestion: {
        question: securityQuestion,
        answer: securityAnswer
      }
    });
  };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-4">
      {/* Full Name */}
      <input
        type="text"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
        required
      />
      
      {/* Username */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
        required
      />
      
      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
        required
      />
      
      {/* Password with Show/Hide Icon */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password (6+ characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </div>

      {/* Security Question */}
      <select
        value={securityQuestion}
        onChange={(e) => setSecurityQuestion(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
        required
      >
        {SECURITY_QUESTIONS.map((question) => (
          <option key={question} value={question}>
            {question}
          </option>
        ))}
      </select>

      {/* Security Answer */}
      <input
        type="text"
        placeholder="Answer to security question"
        value={securityAnswer}
        onChange={(e) => setSecurityAnswer(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
        required
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? (
          <Loader className="size-5 animate-spin mx-auto" />
        ) : (
          "Agree & Join"
        )}
      </button>
    </form>
  );
};

export default SignUpForm;
  