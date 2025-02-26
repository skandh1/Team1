import { Link, useLocation } from "react-router-dom";
import { Home, UserPlus, Bell } from "lucide-react";

const NavLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`
        group flex items-center py-2.5 px-4 rounded-lg transition-all duration-300
        hover:bg-blue-500 hover:text-white
        ${isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:translate-x-1'}
      `}
    >
      <Icon 
        className={`mr-3 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'scale-110' : ''}`} 
        size={20} 
      />
      <span className="font-medium">{children}</span>
    </Link>
  );
};

export default function Sidebar({ user }) {
  return (
    <aside className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Profile Section */}
      <div className="relative pb-4">
        {/* Banner Image */}
        <div
          className="h-24 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url("${user.bannerImg}`,
          }}
        />
        
        {/* Profile Info */}
        <div className="px-4 text-center">
          <Link 
            to={`/profile/${user.username}`}
            className="block transform transition-transform duration-300 hover:scale-105"
          >
            <img
              src={user.profilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
              alt={user.name}
              className="w-20 h-20 rounded-full mx-auto mt-[-40px] border-4 border-white shadow-md object-cover"
            />
            <h2 className="text-xl font-semibold mt-3 text-gray-900">{user.name}</h2>
          </Link>
          
          <p className="text-gray-600 mt-1 text-sm">{user.headline}</p>
          
          <div className="mt-2 inline-flex items-center gap-1 text-sm text-gray-500">
            <span className="font-semibold text-blue-600">{user.connections.length}</span>
            <span>connections</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 border-t border-gray-100">
        <ul className="space-y-1">
          <li>
            <NavLink to="/" icon={Home}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/network" icon={UserPlus}>My Network</NavLink>
          </li>
          <li>
            <NavLink to="/notifications" icon={Bell}>Notifications</NavLink>
          </li>
        </ul>
      </nav>

      {/* Profile Link */}
      <div className="p-4 border-t border-gray-100">
        <Link
          to={`/profile/${user.username}`}
          className="
            inline-flex items-center text-sm font-medium text-blue-600
            transition-all duration-300
            hover:text-blue-700 hover:underline
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            rounded-lg
          "
        >
          Visit your profile
          <svg
            className="ml-1.5 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </aside>
  );
}