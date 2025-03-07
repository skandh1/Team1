import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.js";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";



const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { mutate: verifyEmail, isLoading: isVerifyingEmail } = useMutation({
    mutationFn: async (email) => {
      try {
        const res = await axiosInstance.post("/auth/verifyEmail", { email });
        setSecurityQuestion(res.data.securityQuestion);
        setStep(2);
      } catch (error) {
        toast.error(error.response.data.message || "Email not found");
      }
    },
  });

  const { mutate: verifyAnswer, isLoading: isVerifyingAnswer } = useMutation({
    mutationFn: async (data) => {
      try {
        await axiosInstance.post("/auth/verifySecurityAnswer", data);
        setStep(3);
      } catch (error) {
        toast.error(error.response.data.message || "Incorrect answer");
      }
    },
  });

  const { mutate: resetPassword, isLoading: isResetting } = useMutation({
    mutationFn: async (data) => {
      try {
        await axiosInstance.post("/auth/resetPassword", data);
        toast.success("Password reset successfully");
        window.location.href = "/login";
        navigate("/login");
      } catch (error) {
        toast.error(error.response.data.message || "Failed to reset password");
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      verifyEmail(email);
    } else if (step === 2) {
      verifyAnswer({ email, answer: securityAnswer });
    } else {
      resetPassword({ email, newPassword });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {step === 1 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Enter your email</h3>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            required
          />
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Security Question</h3>
          <p className="mb-4">{securityQuestion}</p>
          <input
            type="text"
            placeholder="Your answer"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            required
          />
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Set New Password</h3>
          <input
            type="password"
            placeholder="New password (6+ characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            required
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isVerifyingEmail || isVerifyingAnswer || isResetting}
        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {(isVerifyingEmail || isVerifyingAnswer || isResetting) ? (
          <Loader className="size-5 animate-spin mx-auto" />
        ) : (
          step === 3 ? "Reset Password" : "Continue"
        )}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;