import { useLocation } from 'react-router-dom';
import Navbar from "./Navbar";

const Layout = ({ children }) => {
	const location = useLocation();
	const path = location.pathname;
	
	// List of routes where navbar should be hidden
	const hideNavbarRoutes = ['/about', '/login', '/signin', '/signup'];
	
	// Check if current path is in the list of routes where navbar should be hidden
	const shouldHideNavbar = hideNavbarRoutes.includes(path);
	
	return (
		<div className='min-h-screen bg-base-100'>
			{!shouldHideNavbar && <Navbar />}
			<main className='max-w-8xl mx-auto'>{children}</main>
		</div>
	);
};

export default Layout;