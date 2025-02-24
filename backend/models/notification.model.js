import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
	{
		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			required: true,
			enum: ["like", "comment", "connectionAccepted", "selected", "applied", "projectCompleted", "projectRating"],
		},
		relatedUser: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		relatedPost: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
		relatedProject: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Project",
		},
		read: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
