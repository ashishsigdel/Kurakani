import { View, Text, Image, Alert } from "react-native";
import React from "react";
import CustomButton from "./CustomButton";
import { User } from "../types/allTypes";
import { images } from "../constants";

const ChatUser: React.FC<
  User & { isRequestSent: boolean; onRequestToggle: (id: number) => void }
> = ({
  id,
  fullName,
  username,
  email,
  profilePic,
  isRequestSent,
  onRequestToggle,
}) => {
  return (
    <View className="py-3 px-2 flex-row items-center justify-between border-t border-b border-black-200">
      <View className="flex-row items-center space-x-2">
        <Image
          source={profilePic ? { uri: profilePic } : images.profile}
          className="w-[60px] h-[60px] rounded-full"
          resizeMode="contain"
        />
        <View>
          <Text className="text-[18px] text-white font-psemibold">
            {fullName}
          </Text>
          <Text className="text-xs text-white font-psemibold">@{username}</Text>
        </View>
      </View>

      {/* Right Section: Connect or Cancel Button */}
      <CustomButton
        title={isRequestSent ? "Cancel" : "Connect"}
        handlePress={() => onRequestToggle(id)}
        containerStyles={` px-3 py-1 ${
          isRequestSent ? "bg-red-500" : "bg-secondary-200"
        }`}
      />
    </View>
  );
};

export default ChatUser;
