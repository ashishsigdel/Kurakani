import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { images } from "../../constants";
import { CustomButton } from "../../components";
import { router } from "expo-router";
import { myAxios } from "../../helper/myAxios"; // Use the axios instance with interceptors
import { useAuth } from "../../context/GlobalProvider";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    setIsLoading(true);
    myAxios
      .post(`/auth/logout`)
      .then((response) => {
        signOut()
          .then(() => {
            Alert.alert("Sign out Successful", "You have been logged out!");

            router.push("/");
          })
          .catch((error: any) => {
            console.error("Sign out error:", error);
            Alert.alert("Sign out unsuccessful.", error.mesage);
          });
      })
      .catch((error: any) => {
        signOut()
          .then(() => {
            Alert.alert("Sign out Successful", "You have been logged out!");

            router.push("/");
          })
          .catch((error: any) => {
            console.error("Sign out error:", error);
            Alert.alert("Sign out unsuccessful.", error.mesage);
          });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center items-center h-[90vh] px-4 my-6">
          <Text className="text-3xl text-white font-bold text-center">
            Profile
          </Text>
          <Image
            source={
              user?.profilePic ? { uri: user.profilePic } : images.profile
            }
            className="w-[130px] h-[130px] rounded-full mt-7 border border-white"
            resizeMode="contain"
          />
          <Text className="mt-7 text-3xl text-secondary font-pbold ">
            {user?.fullName}
          </Text>
          <Text className="mt-1 text-base text-gray-100 font-psemibold ">
            @{user?.username}
          </Text>
          <Text className="mt-1 text-base text-gray-100 font-psemibold ">
            {user?.email}
          </Text>

          <CustomButton
            title="Edit Profile"
            handlePress={() => router.push("/")}
            containerStyles="mt-7 w-full bg-secondary-200 min-h-[52px]"
            isLoading={isLoading}
          />
          <CustomButton
            title="Sign Out"
            handlePress={handleSignOut}
            containerStyles="mt-5 w-full bg-red-500 min-h-[52px]"
            isLoading={isLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
