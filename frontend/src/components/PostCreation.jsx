import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Image, Loader, X, SendHorizontal } from "lucide-react";

const PostCreation = ({ user }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const queryClient = useQueryClient();

  const { mutate: createPostMutation, isPending } = useMutation({
    mutationFn: async (postData) => {
      const res = await axiosInstance.post("/posts/create", postData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: () => {
      resetForm();
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Failed to create post");
    },
  });

  const handlePostCreation = async () => {
    if (!content.trim() && !image) {
      toast.error("Please add some content to your post");
      return;
    }

    try {
      const postData = { content: content.trim() };
      if (image) postData.image = await readFileAsDataURL(image);
      createPostMutation(postData);
    } catch (error) {
      console.error("Error in handlePostCreation:", error);
      toast.error("Failed to create post");
    }
  };

  const resetForm = () => {
    setContent("");
    setImage(null);
    setImagePreview(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleImageChange = (file) => {
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImage(file);
    readFileAsDataURL(file).then(setImagePreview);
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const handleTextareaInput = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setContent(textarea.value);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-4">
        <div className="flex gap-3">
          <img
            src={user.profilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0 transition-transform duration-300 hover:scale-110"
          />
          <textarea
            ref={textareaRef}
            placeholder="What's on your mind?"
            className={`
              w-full p-3 rounded-lg bg-gray-50 
              focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500
              resize-none transition-all duration-300
              ${isDragging ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
            `}
            value={content}
            onChange={handleTextareaInput}
            rows={1}
            style={{ minHeight: '48px' }}
          />
        </div>

        {imagePreview && (
          <div className="relative mt-4 group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-auto rounded-lg transition-all duration-300 group-hover:brightness-90"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300
                hover:bg-black/70"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mt-4 pt-3 border-t">
          <div className="flex items-center gap-2">
            <label
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer
                text-gray-600 hover:bg-gray-100 transition-colors duration-300
                ${image ? 'text-blue-600 hover:bg-blue-50' : ''}
              `}
            >
              <Image size={18} />
              <span className="text-sm font-medium">Add photo</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e.target.files[0])}
              />
            </label>
          </div>

          <button
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full font-medium
              transition-all duration-300 transform
              ${content.trim() || image
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
            onClick={handlePostCreation}
            disabled={isPending || (!content.trim() && !image)}
          >
            {isPending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Share</span>
                <SendHorizontal size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCreation;