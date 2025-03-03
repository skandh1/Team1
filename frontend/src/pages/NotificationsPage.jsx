import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { 
  ClipboardCheck, 
  ExternalLink, 
  Eye, 
  MessageSquare, 
  ThumbsUp, 
  Trash2, 
  UserPlus,
  CheckCircle,
  Trash,
  Star,
	Bell
} from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import RatingModal from "../components/RatingModel";

const NotificationsPage = () => {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => axiosInstance.get("/notifications"),
  });

  const { mutate: markAllAsReadMutation } = useMutation({
    mutationFn: () => axiosInstance.put("/notifications/mark-all-read"),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("All notifications marked as read");
    },
  });

  const { mutate: deleteAllNotificationsMutation } = useMutation({
    mutationFn: () => axiosInstance.delete("/notifications"),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("All notifications deleted");
    },
  });

  const { mutate: markAsReadMutation } = useMutation({
    mutationFn: (id) => axiosInstance.put(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  const { mutate: deleteNotificationMutation } = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("Notification deleted");
    },
  });

	const handleProjectRating = (project) => {
		console.log(project)
    setSelectedProject(project);
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async (ratings) => {
    try {
      await axiosInstance.post(`/editproject/${selectedProject}/ratings`, { ratings });
      toast.success("Ratings submitted successfully");
      setShowRatingModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit ratings");
    }
  };

  const renderNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <ThumbsUp className="text-blue-500" />;
      case "applied":
        return <Eye size={18} className="text-gray-500" />;
      case "comment":
        return <MessageSquare className="text-green-500" />;
      case "connectionAccepted":
        return <UserPlus className="text-purple-500" />;
      case "projectCompleted":
        return <ClipboardCheck className="text-green-500" />;
      case "projectRating":
        return <Star className="text-yellow-500" />;
      case "selected":
        return <UserPlus className="text-purple-800" />;
      case "Removed":
        return <Trash2 className="text-red-500" />;
      default:
        return null;
    }
  };

  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case "like":
        return (
          <span>
            <strong>{notification.relatedUser.name}</strong> liked your post
          </span>
        );
      case "comment":
        return (
          <span>
            <Link to={`/profile/${notification.relatedUser.username}`} className="font-bold hover:underline">
              {notification.relatedUser.name}
            </Link>{" "}
            commented on your post
          </span>
        );
      case "applied":
        return (
          <span>
            <Link to={`/profile/${notification.relatedUser.username}`} className="font-bold hover:underline">
              {notification.relatedUser.name}
            </Link>{" "}
            applied to your project
          </span>
        );
      case "connectionAccepted":
        return (
          <span>
            <Link to={`/profile/${notification.relatedUser.username}`} className="font-bold hover:underline">
              {notification.relatedUser.name}
            </Link>{" "}
            accepted your connection request
          </span>
        );
      case "selected":
        return (
          <span>
            <Link to={`/profile/${notification.relatedUser.username}`} className="font-bold hover:underline">
              {notification.relatedUser.name}
            </Link>{" "}
            selected you in their project
          </span>
        );
      case "projectCompleted":
        return (
          <div>
            <span>Project "{notification.relatedProject}" has been completed. </span>
            <button
              onClick={() => handleProjectRating(notification.relatedProject)}
              className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors"
            >
              <Star size={14} />
              Rate Team Members
            </button>
          </div>
        );
      case "projectRating":
        return (
          <span>
            <Link to={`/profile/${notification.relatedUser.username}`} className="font-bold hover:underline">
              {notification.relatedUser.name}
            </Link>{" "}
            rated your work on project "{notification.relatedProject.name}"
          </span>
        );
      case "Removed":
        return (
          <span>
            <Link to={`/profile/${notification.relatedUser.username}`} className="font-bold hover:underline">
              {notification.relatedUser.name}
            </Link>{" "}
            removed you from their project
          </span>
        )
      case "projectStarted":
        return (
          <span>
            Project "{notification.relatedProject}" has been started.
            {notification.relatedProject.status === "Completed" && (
              <span className="ml-2">
                <CheckCircle size={14} className="text-green-500" />
              </span>
            )}
          </span>
        )
      default:
        return null;
    }
  };

  const renderRelatedPost = (relatedPost) => {
    if (!relatedPost) return null;

    return (
      <Link
        to={`/post/${relatedPost._id}`}
        className="mt-2 p-2 bg-gray-50 rounded-md flex items-center space-x-2 hover:bg-gray-100 transition-colors"
      >
        {relatedPost.image && (
          <img src={relatedPost.image} alt="Post preview" className="w-10 h-10 object-cover rounded" />
        )}
        <div className="flex-1 overflow-hidden">
          <p className="text-sm text-gray-600 truncate">{relatedPost.content}</p>
        </div>
        <ExternalLink size={14} className="text-gray-400" />
      </Link>
    );
  };

  const unreadCount = notifications?.data.filter(n => !n.read).length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="col-span-1 lg:col-span-1">
            <Sidebar user={authUser} />
          </div>
          <div className="col-span-1 lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    {unreadCount > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllAsReadMutation()}
                        className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Mark all as read
                      </button>
                    )}
                    {notifications?.data.length > 0 && (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete all notifications?')) {
                            deleteAllNotificationsMutation();
                          }
                        }}
                        className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                      >
                        <Trash size={16} className="mr-2" />
                        Delete all
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading notifications...</p>
                  </div>
                ) : notifications?.data.length > 0 ? (
                  notifications.data.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 sm:p-6 transition-colors ${
                        !notification.read ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <Link 
                          to={`/profile/${notification.relatedUser.username}`}
                          className="flex-shrink-0"
                        >
                          <img
                            src={notification.relatedUser.profilePicture || "/avatar.png"}
                            alt={notification.relatedUser.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2">
                            <div className="p-1.5 bg-white rounded-full shadow-sm">
                              {renderNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm sm:text-base">
                                {renderNotificationContent(notification)}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDistanceToNow(new Date(notification.createdAt), {
                                  addSuffix: true,
                                })}
                              </p>
                              {renderRelatedPost(notification.relatedPost)}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={() => markAsReadMutation(notification._id)}
                              className="p-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
                              title="Mark as read"
                            >
                              <Eye size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotificationMutation(notification._id)}
                            className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                            title="Delete notification"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                      <Bell className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="mt-4 text-gray-500">No notifications at the moment.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showRatingModal && selectedProject && (
        <RatingModal
          project={selectedProject}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
};

export default NotificationsPage;