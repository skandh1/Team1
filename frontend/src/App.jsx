import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import AboutPage from "./pages/AboutPage";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import NotificationsPage from "./pages/NotificationsPage";
import NetworkPage from "./pages/NetworkPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import ProjectDisplayPage from "./pages/ProjectDisplayPage";
import MyProjectsPage from "./pages/MyProjectsPage";
import AppliedProjectPage from "./pages/appliedProjectPage";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFoundPage.tsx";

function App() {
    const { data: authUser, isLoading } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get("/auth/me");
                return res.data;
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    return null;
                }
                toast.error(err.response.data.message || "Something went wrong");
            }
        },
    });

    if (isLoading) return null;

    return (
        <Layout>
            <Routes>
                <Route path='/' element={authUser ? <HomePage /> : <Navigate to={'/about'} />} />
                <Route path='/about' element={!authUser ? <AboutPage /> : <Navigate to={'/'} />} />
                <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to={'/'} />} />
                <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={'/'} />} />
                <Route path='/notifications' element={authUser ? <NotificationsPage /> : <Navigate to={'/login'} />} />
                <Route path='/editProject' element={authUser ? <MyProjectsPage /> : <Navigate to={'/login'} />} />
                <Route path='/appliedProject' element={authUser ? <AppliedProjectPage /> : <Navigate to={'/login'} />} />
                <Route path='/chat' element={authUser ? <ChatPage /> : <Navigate to={'/login'} />} />

                <Route path='/projectdisplay' element={authUser ? <ProjectDisplayPage /> : <Navigate to={'/login'} />} />
                <Route path='/search' element={authUser ? <SearchPage /> : <Navigate to={'/login'} />} />
								<Route path='/createprojectpage' element={authUser ? <CreateProjectPage /> : <Navigate to={'/login'} />} />
                <Route path='/network' element={authUser ? <NetworkPage /> : <Navigate to={'/login'} />} />
                <Route path='/post/:postId' element={authUser ? <PostPage /> : <Navigate to={'/login'} />} />
                <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to={'/login'} />} />
                <Route path='*' element={<NotFound />} />
					
            </Routes>
            <Toaster />
        </Layout>
    );
}

export default App;
