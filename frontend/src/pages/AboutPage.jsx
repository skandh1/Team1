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
  BellRing,
  UserCircle,
  Briefcase,
  PenSquare,
  Zap,
  Heart,
  Star,
  Layers
} from "lucide-react";

function AboutPage() {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    stats: false,
    features: false,
    testimonials: false,
    howItWorks: false,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.observe-section');
    sections.forEach(section => observer.observe(section));

    // Initial animation for hero section
    setTimeout(() => {
      setIsVisible(prev => ({
        ...prev,
        hero: true
      }));
    }, 100);

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  const stats = [
    { number: "10K+", label: "Active Users", icon: Users },
    { number: "50K+", label: "Projects Posted", icon: Briefcase },
    { number: "1M+", label: "Messages Sent", icon: MessageSquare },
    { number: "100+", label: "Countries", icon: Globe2 },
  ];

  const features = [
    {
      title: "Social Feed",
      description: "Connect with peers, share updates, and stay informed with a personalized feed",
      icon: PenSquare,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Real-time Chat",
      description: "Seamless communication with project members and friends in real-time",
      icon: MessageSquare,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Project Collaboration",
      description: "Create or join projects and collaborate with talented developers",
      icon: Briefcase,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-100"
    },
    {
      title: "Project Marketplace",
      description: "Post projects or find exciting opportunities to work on",
      icon: Rocket,
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-100"
    },
    {
      title: "Profile Management",
      description: "Showcase your skills, track your ratings, and build your reputation",
      icon: UserCircle,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-100"
    },
    {
      title: "Smart Notifications",
      description: "Stay updated with real-time notifications for all activities",
      icon: BellRing,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-100"
    },
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Frontend Developer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      quote: "Teamify transformed how I collaborate. I've found amazing projects and built connections that advanced my career."
    },
    {
      name: "Sarah Chen",
      role: "UX Designer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      quote: "The platform's intuitive design and powerful features make collaboration seamless. I've grown my network exponentially."
    },
    {
      name: "Michael Rodriguez",
      role: "Full Stack Developer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      quote: "From idea to execution, Teamify provides all the tools needed to build successful projects with talented people."
    }
  ];

  const steps = [
    {
      title: "Create Your Profile",
      description: "Showcase your skills, experience, and interests to stand out",
      icon: UserCircle,
      color: "bg-blue-500"
    },
    {
      title: "Connect & Explore",
      description: "Browse the feed, connect with peers, and discover exciting projects",
      icon: Globe2,
      color: "bg-purple-500"
    },
    {
      title: "Join or Create Projects",
      description: "Find the perfect project or start your own and recruit talent",
      icon: Briefcase,
      color: "bg-indigo-500"
    },
    {
      title: "Collaborate & Grow",
      description: "Work together, communicate in real-time, and build your reputation",
      icon: Zap,
      color: "bg-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:32px_32px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 backdrop-blur-3xl" />

        <div
          id="hero"
          className={`observe-section relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center transition-all duration-1000 transform ${
            isVisible.hero
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex justify-center mb-6">
            
            <img className="h-24 w-auto rounded" src="/teamify_logo_only.svg" alt="Logo" />
          
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Teamify: Where Ideas Come to Life
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with passionate developers, collaborate on exciting projects, and build your professional network. 
            All in one powerful platform designed for modern teams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
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
          
          {/* Floating UI Elements */}
          <div className="relative mt-16 mx-auto max-w-5xl">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-3 divide-x divide-gray-100">
                <div className="p-6 flex items-center justify-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <PenSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">Social Feed</h3>
                      <p className="text-sm text-gray-500">Connect & Share</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">Real-time Chat</h3>
                      <p className="text-sm text-gray-500">Seamless Communication</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Briefcase className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">Project Hub</h3>
                      <p className="text-sm text-gray-500">Create & Collaborate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl transform rotate-12 opacity-70"></div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl transform -rotate-12 opacity-70"></div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div
        id="stats"
        className={`observe-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-all duration-1000 transform ${
          isVisible.stats
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Developers Worldwide</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join our growing community of developers and creators building the future together
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div
        id="features"
        className={`observe-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-all duration-1000 transform ${
          isVisible.features
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to enhance collaboration and productivity
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-102 border border-gray-100 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 ${feature.bgColor} rounded-xl`}>
                    <feature.icon className={`w-6 h-6 text-gradient bg-gradient-to-r ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {feature.description}
                </p>
                <div className="mt-auto">
                  <Link
                    to={`/features/${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
                  >
                    Learn more
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div
        id="howItWorks"
        className={`observe-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-all duration-1000 transform ${
          isVisible.howItWorks
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How Teamify Works</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your journey from sign-up to successful collaboration in four simple steps
          </p>
        </div>
        
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform -translate-y-1/2 hidden md:block"></div>
          
          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div
        id="testimonials"
        className={`observe-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-all duration-1000 transform ${
          isVisible.testimonials
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hear from developers who have transformed their workflow with Teamify
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
            >
              <div className="mb-6">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 italic mb-6 flex-grow">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Layers className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform How You Collaborate?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already building amazing
              projects and growing their careers with Teamify.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Join Now
                <CheckCircle className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/demo"
                className="inline-flex items-center px-8 py-4 rounded-xl bg-blue-500/20 backdrop-blur-sm text-white border border-white/30 font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Watch Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-gray-600 hover:text-blue-600">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-600 hover:text-blue-600">Pricing</Link></li>
                <li><Link to="/roadmap" className="text-gray-600 hover:text-blue-600">Roadmap</Link></li>
                <li><Link to="/changelog" className="text-gray-600 hover:text-blue-600">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/blog" className="text-gray-600 hover:text-blue-600">Blog</Link></li>
                <li><Link to="/documentation" className="text-gray-600 hover:text-blue-600">Documentation</Link></li>
                <li><Link to="/guides" className="text-gray-600 hover:text-blue-600">Guides</Link></li>
                <li><Link to="/help" className="text-gray-600 hover:text-blue-600">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-600 hover:text-blue-600">About Us</Link></li>
                <li><Link to="/careers" className="text-gray-600 hover:text-blue-600">Careers</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link></li>
                <li><Link to="/press" className="text-gray-600 hover:text-blue-600">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-600 hover:text-blue-600">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-600 hover:text-blue-600">Terms of Service</Link></li>
                <li><Link to="/cookies" className="text-gray-600 hover:text-blue-600">Cookie Policy</Link></li>
                <li><Link to="/security" className="text-gray-600 hover:text-blue-600">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="flex justify-center mb-6">
            
            <img className="h-12 w-auto rounded" src="/teamify.svg" alt="Logo" />
          
          </div>
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Teamify. All rights reserved.
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AboutPage;