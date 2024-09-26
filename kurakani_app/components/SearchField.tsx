import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";

interface SearchFieldProps {
  handleChange: (text: string) => void;
  otherStyles?: string;
  value?: string;
  placeholder?: string;
  handleSearch?: () => void;
}

const SearchField: React.FC<SearchFieldProps> = ({
  value,
  placeholder,
  handleChange,
  otherStyles,
  handleSearch,
  ...props
}) => {
  return (
    <View className={`space-y-2 ${otherStyles} w-full px-2`}>
      <View className="w-full h-12 px-4 bg-black-100 border-2 border-black-200 focus:border-black-400 rounded-2xl items-center justify-center flex-row">
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChange}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Image
            source={icons.search}
            className="h-5 w-5"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchField;
