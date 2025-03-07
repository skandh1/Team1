import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { Loader, MessageCircle, Send, Share2, ThumbsUp, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const PostAction = ({ icon, text, onClick, active = false }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors
      ${active 
        ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
        : 'text-gray-600 hover:bg-gray-100'
      }`}
  >
    {icon}
    <span className="text-sm font-medium">{text}</span>
  </button>
);

const Post = ({ post }) => {
  const { postId } = useParams();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  
  const isOwner = authUser._id === post.author._id;
  const isLiked = post.likes.includes(authUser._id);
  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: () => axiosInstance.delete(`/posts/delete/${post._id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const { mutate: createComment, isPending: isAddingComment } = useMutation({
    mutationFn: (content) => axiosInstance.post(`/posts/${post._id}/comment`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Comment added");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to add comment"),
  });

  const { mutate: likePost, isPending: isLikingPost } = useMutation({
    mutationFn: () => axiosInstance.post(`/posts/${post._id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  const handleDeletePost = () => {
    if (window.confirm("Delete this post?")) deletePost();
  };

  const handleLikePost = () => {
    if (!isLikingPost) likePost();
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    const content = newComment.trim();
    if (!content) return;

    createComment(content);
    setNewComment("");
    setComments([
      ...comments,
      {
        content,
        user: {
          _id: authUser._id,
          name: authUser.name,
          profilePicture: authUser.profilePicture,
        },
        createdAt: new Date(),
      },
    ]);
  };

  return (
    <article className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <Link 
            to={`/profile/${post?.author?.username}`}
            className="flex items-center gap-3 group"
          >
            <img
              src={post.author.profilePicture || "/avatar.png"}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {post.author.name}
              </h3>
              <div className="flex flex-col text-xs text-gray-500">
                <span>{post.author.headline}</span>
                <time>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</time>
              </div>
            </div>
          </Link>

          {isOwner && (
            <button 
              onClick={handleDeletePost}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              disabled={isDeletingPost}
            >
              {isDeletingPost ? (
                <Loader className="animate-spin" size={18} />
              ) : (
                <Trash2 size={18} />
              )}
            </button>
          )}
        </div>

        {/* Post Content */}
        <div className="mt-4">
          <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
          {post.image && (
            <img 
              src={post.image} 
              alt="Post content" 
              className="mt-4 rounded-lg w-full object-cover max-h-[512px]"
            />
          )}
        </div>

        {/* Post Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <PostAction
            icon={<ThumbsUp size={18} className={isLiked ? "fill-current" : ""} />}
            text={`${post.likes.length} Likes`}
            onClick={handleLikePost}
            active={isLiked}
          />
          <PostAction
            icon={<MessageCircle size={18} />}
            text={`${comments.length} Comments`}
            onClick={() => setShowComments(!showComments)}
            active={showComments}
          />
          {/* <PostAction
            icon={<Share2 size={18} />}
            text="Share"
          /> */}
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t bg-gray-50">
          <div className="max-h-[320px] overflow-y-auto p-4 space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-3">
                <img
                  src={comment.user.profilePicture || "/avatar.png"}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{comment.user.name}</span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt))}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-800">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form 
            onSubmit={handleAddComment}
            className="p-4 border-t bg-white flex gap-2"
          >
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={isAddingComment || !newComment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAddingComment ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>
      )}
    </article>
  );
};

export default Post;