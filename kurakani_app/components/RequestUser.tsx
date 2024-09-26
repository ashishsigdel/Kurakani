import { View, Text, Image, Alert } from "react-native";
import React, { useState } from "react";
import { images } from "../constants";
import CustomButton from "./CustomButton";
import { formatDistanceToNow } from "date-fns"; // Import from date-fns
import { RequestTypes } from "../types/allTypes";
import { myAxios } from "../helper/myAxios";

const RequestUser: React.FC<RequestTypes> = ({
  id,
  message,
  createdAt,
  sender,
  onRequestResponse,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const timeAgo = formatDistanceToNow(new Date(createdAt), {
    includeSeconds: true,
    addSuffix: true,
  }).replace("about ", "");

  const handleAcceptRequest = () => {
    myAxios
      .post(`connection/accept?connectionRequestId=${id}`)
      .then((response) => {
        onRequestResponse(id);
      })
      .catch((error) => {
        if (error.response.data.message) {
          Alert.alert("Unsuccessful.", error.response.data.message);
        } else {
          Alert.alert("Unsuccessful.", "Something Went Wrong!");
        }
      });
  };
  const handleRejectRequest = () => {
    myAxios
      .post(`connection/reject?connectionRequestId=${id}`)
      .then((response) => {
        onRequestResponse(id);
      })
      .catch((error) => {
        if (error.response.data.message) {
          Alert.alert("Request Delete failed.", error.response.data.message);
        } else {
          Alert.alert("Request Delete failed.", "Something Went Wrong!");
        }
      });
  };

  return (
    <View className="py-4 px-2 flex-row items-center justify-between border-b border-black-200">
      <View className="flex-row items-center space-x-5">
        <Image
          source={
            sender.profilePic ? { uri: sender.profilePic } : images.profile
          }
          className="w-[60px] h-[60px] rounded-full"
          resizeMode="contain"
        />
        <View className="flex-1">
          <Text className="text-[18px] text-white font-semibold mb-1">
            {sender.fullName}
          </Text>
          <Text className="text-[12px] text-white font-semibold mb-0.5">
            {message}
          </Text>
          <Text className="text-[12px] text-gray-400 mb-3">{timeAgo}</Text>
          <View className="flex-row">
            <View className="flex-1 mr-2">
              <CustomButton
                title="Accept"
                handlePress={handleAcceptRequest}
                containerStyles="bg-secondary-200 px-3 h-10 w-full"
                isLoading={isLoading}
              />
            </View>
            <View className="flex-1">
              <CustomButton
                title="Reject"
                handlePress={handleRejectRequest}
                containerStyles="bg-red-500 px-3 h-10 w-full"
                textStyles="text-white"
                isLoading={isLoading}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RequestUser;
