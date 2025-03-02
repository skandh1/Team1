import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";
import { 
  Bell, 
  Home, 
  LogOut, 
  User, 
  Users, 
  SearchCheck,
  MessageSquare,
  FolderKanban,
  PlusCircle,
  Briefcase,
  ClipboardCheck,
  Menu,
  X
} from "lucide-react";

const NavLink = ({ to, icon: Icon, label, count, onClick }) => (
  <Link 
    to={to} 
    className="relative flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
    onClick={onClick}
  >
    <Icon size={20} className="text-gray-700" />
    <span className="text-xs mt-1 text-gray-600 font-medium">{label}</span>
    {count > 0 && (
      <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold
        rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
        {count}
      </span>
    )}
  </Link>
);

const MobileNavLink = ({ to, icon: Icon, label, count, onClick }) => (
  <Link 
    to={to} 
    className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors w-full"
    onClick={onClick}
  >
    <div className="relative">
      <Icon size={20} className="text-gray-700" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold
          rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {count}
        </span>
      )}
    </div>
    <span className="text-gray-700 font-medium">{label}</span>
  </Link>
);

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => axiosInstance.get("/notifications"),
    enabled: !!authUser,
  });

  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async () => axiosInstance.get("/connections/requests"),
    enabled: !!authUser,
  });

  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setMobileMenuOpen(false);
    },
  });

  const unreadNotificationCount = notifications?.data.filter((notif) => !notif.read).length || 0;
  const unreadConnectionRequestsCount = connectionRequests?.data?.length || 0;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img className="h-10 w-auto rounded" src="/teamify.svg" alt="Logo" />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          {authUser ? (
            <>
              <div className="hidden md:flex items-center space-x-1 md:space-x-2">
                <NavLink to="/" icon={Home} label="Home" count={0} />
                <NavLink to="/chat" icon={MessageSquare} label="Chat" count={0} />
                <NavLink to="/editProject" icon={FolderKanban} label="My Projects" count={0} />
                <NavLink to="/projectdisplay" icon={Briefcase} label="Browse" count={0} />
                <NavLink to="/search" icon={SearchCheck} label="Search" count={0} />
                <NavLink to="/appliedProject" icon={ClipboardCheck} label="Applied" count={0} />
                <NavLink to="/network" icon={Users} label="Network" count={unreadConnectionRequestsCount} />
                <NavLink to="/notifications" icon={Bell} label="Alerts" count={unreadNotificationCount} />
                <NavLink to="/createprojectpage" icon={PlusCircle} label="Create" count={0} />
                
                {/* User Menu */}
                <div className="flex items-center pl-2 ml-2 border-l border-gray-200">
                  <Link
                    to={`/profile/${authUser.username}`}
                    className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <User size={20} className="text-gray-700" />
                    <span className="hidden md:block text-sm text-gray-700">Profile</span>
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition-colors text-red-600"
                    type="button"
                  >
                    <LogOut size={20} />
                    <span className="hidden md:block text-sm">Logout</span>
                  </button>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  type="button"
                  className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <span className="sr-only">Open menu</span>
                  <Menu size={24} className={`${mobileMenuOpen ? 'hidden' : 'block'}`} />
                  <X size={24} className={`${mobileMenuOpen ? 'block' : 'hidden'}`} />
                </button>
                
                {/* Notification indicators for mobile */}
                <div className="flex items-center space-x-2 ml-2">
                  {unreadNotificationCount > 0 && (
                    <div className="relative">
                      <Bell size={20} className="text-gray-700" />
                      <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold
                        rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {unreadNotificationCount}
                      </span>
                    </div>
                  )}
                  {unreadConnectionRequestsCount > 0 && (
                    <div className="relative">
                      <Users size={20} className="text-gray-700" />
                      <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold
                        rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {unreadConnectionRequestsCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg 
                  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Join now
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {authUser && mobileMenuOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25 z-40" onClick={closeMobileMenu}></div>
          <div className="fixed right-0 top-0 bottom-0 w-64 bg-white z-50 shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
              <button 
                type="button" 
                className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
                onClick={closeMobileMenu}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-2 space-y-1">
              <MobileNavLink to="/" icon={Home} label="Home" count={0} onClick={closeMobileMenu} />
              <MobileNavLink to="/chat" icon={MessageSquare} label="Chat" count={0} onClick={closeMobileMenu} />
              <MobileNavLink to="/editProject" icon={FolderKanban} label="My Projects" count={0} onClick={closeMobileMenu} />
              <MobileNavLink to="/projectdisplay" icon={Briefcase} label="Browse" count={0} onClick={closeMobileMenu} />
              <MobileNavLink to="/search" icon={SearchCheck} label="Search" count={0} onClick={closeMobileMenu} />
              <MobileNavLink to="/appliedProject" icon={ClipboardCheck} label="Applied" count={0} onClick={closeMobileMenu} />
              <MobileNavLink to="/network" icon={Users} label="Network" count={unreadConnectionRequestsCount} onClick={closeMobileMenu} />
              <MobileNavLink to="/notifications" icon={Bell} label="Alerts" count={unreadNotificationCount} onClick={closeMobileMenu} />
              <MobileNavLink to="/createprojectpage" icon={PlusCircle} label="Create" count={0} onClick={closeMobileMenu} />
              
              <div className="border-t border-gray-200 my-2 pt-2">
                <MobileNavLink 
                  to={`/profile/${authUser.username}`} 
                  icon={User} 
                  label="Profile" 
                  count={0} 
                  onClick={closeMobileMenu}
                />
                <button
                  onClick={() => logout()}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors w-full text-red-600"
                  type="button"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;