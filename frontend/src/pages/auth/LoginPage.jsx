import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen w-full flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="/image2.jpg"
          alt="Professional workspace"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 mix-blend-multiply" />
        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
          <h1 className="text-4xl font-bold mb-6">Welcome back!</h1>
          <p className="text-lg text-white/90 leading-relaxed max-w-md">
            Sign in to continue your professional journey with Teamify.
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <p className="text-white/80">Resume your conversations</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-white/80">Track your progress</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-white/80">Pick up right where you left off</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 xl:px-24 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center justify-center mb-8">
            <img className="h-12 w-auto" src="/teamify_logo.svg" alt="Teamify" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Welcome back
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Sign in to continue your journey
          </p>

          <LoginForm />

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
        </div>
      </div>
    </div>
  );
};

export default LoginPage;