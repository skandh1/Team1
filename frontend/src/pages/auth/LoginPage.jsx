import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import LoginForm from "../../components/auth/LoginForm";
import ForgotPasswordForm from "../../components/auth/ForgetPasswordForm";

const LoginPage = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          alt="Professional workspace"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 mix-blend-multiply" />
        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
          <h1 className="text-4xl font-bold mb-6">
            {showForgotPassword ? "Reset Your Password" : "Welcome back!"}
          </h1>
          <p className="text-lg text-white/90 leading-relaxed max-w-md">
            {showForgotPassword 
              ? "Don't worry! It happens to the best of us. Follow the steps to reset your password securely."
              : "Sign in to continue your professional journey with Teamify."
            }
          </p>
          {!showForgotPassword && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <p className="text-white/80">Resume your conversations</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <p className="text-white/80">Track your progress</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <p className="text-white/80">Pick up right where you left off</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Login/Forgot Password form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 xl:px-24 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center justify-center mb-8">
            <img className="h-12 w-auto" src="/teamify_logo.svg" alt="Teamify" />
          </div>
          
          {showForgotPassword ? (
            <>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="flex items-center text-indigo-600 hover:text-indigo-500 mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </button>
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
                Forgot Password?
              </h2>
              <p className="text-center text-gray-600 mb-8">
                No worries, we'll help you recover your account
              </p>
              <ForgotPasswordForm />
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
                Welcome back
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Sign in to continue your journey
              </p>
              <LoginForm onForgotPassword={() => setShowForgotPassword(true)} />

              <div className="mt-8">
                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 px-4 text-sm text-gray-500">
                    New to Teamify?
                  </span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <Link
                  to="/signup"
                  className="mt-6 w-full inline-flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors duration-300"
                >
                  Create an account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <p className="mt-8 text-center text-sm text-gray-500">
                By signing in, you agree to our{" "}
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Privacy Policy
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;