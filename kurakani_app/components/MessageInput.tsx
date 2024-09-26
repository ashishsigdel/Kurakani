import { View, TextInput, TouchableOpacity, Image } from "react-native";
import React from "react";
import { icons } from "../constants";

interface MessageInputProps {
  handleChange: (text: string) => void;
  otherStyles?: string;
  value?: string;
  placeholder?: string;
  onSend: () => void; // Add onSend prop
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  placeholder,
  handleChange,
  otherStyles,
  onSend, // Destructure onSend prop
}) => {
  return (
    <View className={`flex-1 flex-row items-center px-2 ${otherStyles}`}>
      <TextInput
        className="flex-1 text-white font-psemibold text-base bg-black-100 border-2 border-black-200 rounded-2xl px-4 py-[6px]"
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#7b7b8b"
        onChangeText={handleChange}
      />
      <TouchableOpacity onPress={onSend}>
        <Image
          source={icons.send}
          className="h-5 w-5 ml-2"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default MessageInput;
