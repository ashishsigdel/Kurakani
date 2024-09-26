import { View, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../../constants";
import MessageInput from "../MessageInput";

const BottomBar = ({ form, setForm, handleChange, handleSend }: any) => {
  return (
    <View className="w-full flex-row items-center h-[68px] pb-1 px-3 border-t border-black-200">
      {/* Icon section */}
      <View className="flex-row items-center space-x-3">
        <Image
          source={icons.plus}
          className="w-[25px] h-[25px]"
          resizeMode="contain"
        />
        <Image
          source={icons.upload}
          className="w-[25px] h-[25px] invert opacity-90"
          resizeMode="contain"
        />
      </View>

      {/* Message Input section */}
      <View className="flex-1 ml-3">
        <MessageInput
          value={form.message}
          handleChange={handleChange}
          onSend={handleSend}
          placeholder="Message..."
          otherStyles=""
        />
      </View>
    </View>
  );
};

export default BottomBar;
