import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  AlertCircle, 
  ArrowLeft, 
  Briefcase, 
  FileText, 
  HelpCircle, 
  Home, 
  Lock, 
  MessageSquare, 
  Users 
} from 'lucide-react';

const NotFound: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  // Define route-specific content
  const routeContent: Record<string, { 
    title: string; 
    message: string; 
    icon: React.ReactNode; 
    action?: { text: string; to: string; };
    requiresAuth?: boolean;
  }> = {
    '/careers': {
      title: 'Careers',
      message: 'We\'re not hiring at the moment, but check back soon for exciting opportunities to join our team!',
      icon: <Briefcase className="w-12 h-12 text-blue-500" />,
      action: { text: 'Back to About', to: '/about' }
    },
    '/blog': {
      title: 'Blog',
      message: 'Our blog is coming soon! We\'re working on insightful content about collaboration, development, and team building.',
      icon: <FileText className="w-12 h-12 text-purple-500" />,
      action: { text: 'Back to Home', to: '/' }
    },
    '/documentation': {
      title: 'Documentation',
      message: 'Our documentation is currently being updated. Please check back later for comprehensive guides and tutorials.',
      icon: <FileText className="w-12 h-12 text-indigo-500" />,
      action: { text: 'Back to Home', to: '/' }
    },
    '/projectdisplay': {
      title: 'Projects',
      message: 'You need to be logged in to view and interact with projects.',
      icon: <Lock className="w-12 h-12 text-amber-500" />,
      requiresAuth: true,
      action: { text: 'Sign In', to: '/login' }
    },
    '/features': {
      title: 'Features',
      message: 'We\'re currently enhancing our features page. Check back soon to learn more about what Teamify offers!',
      icon: <HelpCircle className="w-12 h-12 text-green-500" />,
      action: { text: 'Back to About', to: '/about' }
    },
    '/contact': {
      title: 'Contact',
      message: 'Our contact form is temporarily unavailable. Please check back soon!',
      icon: <MessageSquare className="w-12 h-12 text-blue-500" />,
      action: { text: 'Back to Home', to: '/' }
    },
    '/help': {
      title: 'Help Center',
      message: 'Our help center is under construction. We\'re working to provide you with the best support resources.',
      icon: <HelpCircle className="w-12 h-12 text-purple-500" />,
      action: { text: 'Back to Home', to: '/' }
    },
    '/pricing': {
      title: 'Pricing',
      message: 'We\'re finalizing our pricing plans. Check back soon for details on our competitive offerings!',
      icon: <FileText className="w-12 h-12 text-indigo-500" />,
      action: { text: 'Back to About', to: '/about' }
    },
    '/roadmap': {
      title: 'Roadmap',
      message: 'Our product roadmap is being updated. Check back soon to see what exciting features we\'re working on!',
      icon: <FileText className="w-12 h-12 text-blue-500" />,
      action: { text: 'Back to About', to: '/about' }
    },
    '/changelog': {
      title: 'Changelog',
      message: 'Our changelog is being compiled. Check back soon to see our development progress!',
      icon: <FileText className="w-12 h-12 text-green-500" />,
      action: { text: 'Back to About', to: '/about' }
    },
    '/guides': {
      title: 'Guides',
      message: 'Our guides are currently being written. Check back soon for helpful tutorials!',
      icon: <FileText className="w-12 h-12 text-amber-500" />,
      action: { text: 'Back to Home', to: '/' }
    },
    '/press': {
      title: 'Press',
      message: 'Our press page is coming soon. Check back for the latest news and announcements!',
      icon: <FileText className="w-12 h-12 text-purple-500" />,
      action: { text: 'Back to About', to: '/about' }
    },
    '/privacy': {
      title: 'Privacy Policy',
      message: 'Our privacy policy is being updated to ensure compliance with the latest regulations.',
      icon: <FileText className="w-12 h-12 text-blue-500" />,
      action: { text: 'Back to Home', to: '/' }
    },
    '/terms': {
      title: 'Terms of Service',
      message: 'Our terms of service are being reviewed by our legal team and will be available soon.',
      icon: <FileText className="w-12 h-12 text-indigo-500" />,
      action: { text: 'Back to Home', to: '/' }
    },
    '/cookies': {
      title: 'Cookie Policy',
      message: 'Our cookie policy is being updated to ensure transparency about how we use cookies.',
      icon: <FileText className="w-12 h-12 text-green-500" />,
      action: { text: 'Back to Home', to: '/' }
    },
    '/security': {
      title: 'Security',
      message: 'Our security page is being developed to provide information about how we protect your data.',
      icon: <Lock className="w-12 h-12 text-amber-500" />,
      action: { text: 'Back to Home', to: '/' }
    },
    '/demo': {
      title: 'Demo',
      message: 'Our product demo is currently being prepared. Check back soon to see Teamify in action!',
      icon: <FileText className="w-12 h-12 text-purple-500" />,
      action: { text: 'Back to About', to: '/about' }
    }
  };

  // Check if we have specific content for this path
  const content = routeContent[path] || {
    title: 'Page Not Found',
    message: 'The page you are looking for doesn\'t exist or is still under development.',
    icon: <AlertCircle className="w-12 h-12 text-red-500" />,
    action: { text: 'Back to Home', to: '/' }
  };

  // Extract feature path for specific feature pages
  if (path.startsWith('/features/')) {
    const featureName = path.split('/features/')[1].replace(/-/g, ' ');
    content.title = `${featureName.charAt(0).toUpperCase() + featureName.slice(1)} Feature`;
    content.message = `The ${featureName} feature page is coming soon. Check back later to learn more about this exciting capability!`;
    content.icon = <HelpCircle className="w-12 h-12 text-blue-500" />;
    content.action = { text: 'Back to About', to: '/about' };
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6">
            {content.icon}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{content.title}</h1>
          <p className="text-gray-600 mb-8">{content.message}</p>
          
          {content.requiresAuth && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 w-full">
              <div className="flex items-start">
                <Lock className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-amber-700 text-sm">This section requires authentication. Please sign in or create an account to access this feature.</p>
              </div>
            </div>
          )}
          
          <div className="flex gap-4">
            {content.action && (
              <Link 
                to={content.action.to}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium flex items-center"
              >
                {content.action.to === '/' ? <Home className="w-4 h-4 mr-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
                {content.action.text}
              </Link>
            )}
            
            {content.requiresAuth && (
              <Link 
                to="/signup"
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;