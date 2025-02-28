import { model, Schema } from "mongoose";

const chatSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [
      {
        message: { type: String, required: true },
        senderId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Chat = model("Chat", chatSchema);
export default Chat;
