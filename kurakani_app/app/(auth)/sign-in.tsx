import {
  View,
  Text,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import { Link, router } from "expo-router";
import { useAuth } from "../../context/GlobalProvider";
import { myAxios } from "../../helper/myAxios";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { signIn } = useAuth();
  const handleSubmit = () => {
    myAxios
      .post("/auth/login", form)
      .then((response) => {
        const { accessToken, user } = response.data.data;
        signIn(accessToken, user)
          .then(() => {
            Alert.alert("Login Successful", `Welcome back, ${user.fullName}!`);
            // Redirect to chat screen after successful login
            router.push("/chat");
          })
          .catch((error) => {
            console.error("Error signing in:", error);
            Alert.alert("Sign in unsuccessful.", "Failed to save auth data.");
          });
      })
      .catch((error) => {
        if (error.response.data.message) {
          Alert.alert("SignIn unsuccessful.", error.response.data.message);
        } else {
          Alert.alert("SignIn unsuccessful.", "Something Went Wrong!");
        }
      });
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Moves content on iOS and Android
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <ScrollView>
          <View className="min-h-screen">
            <View className="w-full justify-center items-center h-[90vh] px-4 my-6">
              <Image
                source={images.logo}
                className="w-[130px] h-[130px]"
                resizeMode="contain"
              />
              <Text className="text-3xl text-white font-bold text-center">
                Sign in
              </Text>

              <FormField
                title="Email"
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
              <FormField
                title="Password"
                value={form.password}
                handleChange={(e) =>
                  setForm({
                    ...form,
                    password: e,
                  })
                }
                otherStyles="mt-7"
              />
              <View className="pt-5 w-full items-end">
                <Text className="text-base text-gray-100 font-pregular">
                  Forgot your password?{" "}
                  <Link className="text-secondary-100" href={"/reset-password"}>
                    Reset
                  </Link>
                </Text>
              </View>

              <CustomButton
                title="Sign In"
                handlePress={handleSubmit}
                containerStyles="mt-7 w-full bg-secondary-200 min-h-[52px]"
                isLoading={isSubmitting}
              />

              <View className="justify-center pt-5 flex-row gap-2">
                <Text className="text-base text-gray-100 font-pregular">
                  Don't have an account ?{" "}
                  <Link className="text-secondary-100" href={"/sign-up"}>
                    Create Now
                  </Link>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
