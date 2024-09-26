import {
  View,
  Text,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import { Link } from "expo-router";

const ResetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = () => {};
  return (
    <SafeAreaView className="bg-primary h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Moves content on iOS and Android
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <ScrollView>
          <View className="w-full justify-center items-center min-h-screen px-4 my-6">
            <Image
              source={images.logo}
              className="w-[130px] h-[130px]"
              resizeMode="contain"
            />
            <Text className="text-3xl text-white font-bold text-center">
              Reset Your Password
            </Text>

            <FormField
              title="Enter your email"
              value={form.email}
              handleChange={(e) =>
                setForm({
                  ...form,
                  email: e,
                })
              }
              otherStyles="mt-7"
              keyboardType="email-address"
            />

            <CustomButton
              title="Send Reset Email"
              handlePress={handleSubmit}
              containerStyles="mt-7 w-full bg-secondary min-h-[52px]"
              isLoading={isSubmitting}
            />

            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-base text-gray-100 font-pregular">
                Remember ?{" "}
                <Link className="text-secondary-100" href={"/sign-in"}>
                  Sign In
                </Link>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPassword;
