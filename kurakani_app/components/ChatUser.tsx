import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "../constants";
import { formatDistanceToNow } from "date-fns";
import { useSocket } from "../context/SocketContext";

interface ChatUserProps {
  id: number;
  username: string;
  fullName: string;
  lastMessageAt: Date | string;
  profilePic?: string;
}

const ChatUser: React.FC<ChatUserProps> = ({
  id,
  username,
  fullName,
  lastMessageAt,
  profilePic,
}) => {
  const timeAgo = formatDistanceToNow(new Date(lastMessageAt), {
    includeSeconds: true,
    addSuffix: true,
  }).replace("about ", "");

  const formattedDate = `Last message ${timeAgo}.`;

  const { onlineUsers } = useSocket();

  // Check if the user is online
  const isOnline = onlineUsers.includes(id.toString()); // user IDs are in string form

  return (
    <View className="py-3 px-2 flex-row items-center gap-3">
      <View className="relative">
        <Image
          source={profilePic ? { uri: profilePic } : images.profile}
          className="w-[60px] h-[60px] rounded-full"
          resizeMode="contain"
        />
        {/* Add green dot for online users */}
        {isOnline && (
          <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
        )}
      </View>
      <View>
        <Text className="text-xl text-white font-psemibold">{fullName}</Text>
        <Text className="text-xs text-gray-200 font-normal">
          {formattedDate}
        </Text>
      </View>
    </View>
  );
};

export default ChatUser;
