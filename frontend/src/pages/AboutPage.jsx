import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Rocket,
  Users,
  MessageSquare,
  Code2,
  ArrowRight,
  CheckCircle,
  Globe2,
  Sparkles,
} from "lucide-react";

function AboutPage() {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    stats: false,
    features: false,
  });

  useEffect(() => {
    setIsVisible({
      hero: true,
      stats: true,
      features: true,
    });
  }, []);

  const stats = [
    { number: "10K+", label: "Active Users", icon: Users },
    { number: "50K+", label: "Projects Posted", icon: Code2 },
    { number: "1M+", label: "Messages Sent", icon: MessageSquare },
    { number: "100+", label: "Countries", icon: Globe2 },
  ];

  const features = [
    {
      title: "Project Collaboration",
      description:
        "Connect with talented developers and bring your ideas to life",
      icon: Rocket,
    },
    {
      title: "Real-time Chat",
      description: "Seamless communication with project partners and teams",
      icon: MessageSquare,
    },
    {
      title: "Global Network",
      description: "Access a worldwide community of passionate developers",
      icon: Globe2,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:32px_32px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 backdrop-blur-3xl" />

        <div
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center transition-all duration-1000 transform ${
            isVisible.hero
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex justify-center mb-6">
            <div className="p-2 bg-blue-100 rounded-2xl">
              <Sparkles className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Connect. Create. Grow.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join our thriving community of developers, where collaboration meets
            innovation. Build amazing projects, learn from peers, and take your
            skills to the next level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/projectdisplay"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-gray-800 font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Explore Projects
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-all duration-1000 transform ${
          isVisible.stats
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl text-center hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <div className="flex justify-center mb-4">
                <stat.icon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-all duration-1000 transform ${
          isVisible.features
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
              <div className="mt-6">
                <Link
                  to="/features"
                  className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
                >
                  Learn more
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already building amazing
            projects and growing their careers.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Join Now
            <CheckCircle className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
