import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import { icons, images } from "../../constants";
import { User } from "../../types/allTypes";

interface TopBarProps {
  user: User | null; // Allow for null when no user is present
}

const TopBar: React.FC<TopBarProps> = ({ user }) => {
  return (
    <View className="w-full flex-row items-center space-x-2 pt-2 pb-3 border-b border-black-200 px-3 h-[58px] relative top-0 ">
      <TouchableOpacity onPress={() => router.back()}>
        <Image
          source={icons.leftArrow}
          className="w-[25px] h-[25px]"
          resizeMode="contain"
        />
      </TouchableOpacity>
      <View className="flex-row items-center justify-center gap-5">
        <Image
          source={user?.profilePic ? { uri: user.profilePic } : images.profile}
          className="w-[40px] h-[40px] rounded-full"
          resizeMode="contain"
        />
        <Text className="text-[20px] text-white font-psemibold text-center ">
          {user?.fullName}
        </Text>
      </View>
    </View>
  );
};

export default TopBar;
