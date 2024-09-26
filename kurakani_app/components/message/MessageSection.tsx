import { View, Text } from "react-native";
import React from "react";
import { MessageType } from "../../types/allTypes";

const MessageSection: React.FC<{ message: MessageType }> = ({ message }) => {
  return (
    <View
      className={`w-full py-2 px-3 flex-row ${
        message.isSendByMe ? "justify-end" : "justify-start"
      }`}
    >
      <View
        className={`max-w-[70%] px-3 py-2 rounded-lg ${
          message.isSendByMe ? "bg-secondary-200" : "bg-black-100"
        }`}
      >
        <Text className="text-white font-psemibold">{message.message}</Text>
      </View>
    </View>
  );
};

export default MessageSection;
