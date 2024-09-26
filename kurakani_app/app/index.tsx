import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { images } from "../constants";
import { CustomButton } from "../components";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../context/GlobalProvider";

const index = () => {
  const { user, loading } = useAuth();

  if (!loading && user) return <Redirect href={"/chat"} />;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-primary h-full">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="w-full justify-center items-center h-full px-4">
            <Image
              source={images.logo}
              className="w-[130px] h-[130px]"
              resizeMode="contain"
            />
            <Text className="text-3xl text-white font-bold text-center">
              Connect, Chat, Share Instantly with{" "}
              <Text className="text-secondary-200">KuraKani</Text>
            </Text>
            <Image
              source={images.path}
              className="w-[100px] relative left-28 bottom-4"
              resizeMode="contain"
            />
            <CustomButton
              title="Sign in to continue"
              handlePress={() => {
                router.push("/sign-in");
              }}
              containerStyles="w-full mt-7 bg-secondary-200 min-h-[52px]"
            />
            <CustomButton
              title="Create a new account"
              handlePress={() => {
                router.push("/sign-up");
              }}
              containerStyles="w-full mt-5 bg-secondary-200 min-h-[52px]"
            />
          </View>
        </ScrollView>
        <StatusBar backgroundColor={"#161622"} style="light" />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default index;
