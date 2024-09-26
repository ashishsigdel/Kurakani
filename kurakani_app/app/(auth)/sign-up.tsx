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
import { apiUrl } from "../../constants";
import axios from "axios";
import { myAxios } from "../../helper/myAxios";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = () => {
    myAxios
      .post(`/auth/register`, form)
      .then((response) => {
        Alert.alert(
          "Registration successful.",
          "You have been register successfully."
        );
        setForm({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        router.push("/sign-in");
      })
      .catch((error) => {
        if (error.response.data.message) {
          Alert.alert(
            "Registration unsuccessful.",
            error.response.data.message
          );
        } else {
          Alert.alert("Registration unsuccessful.", "Something Went Wrong!");
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
            <View className="w-full justify-center items-center min-h-[90vh] px-4 my-6">
              <Image
                source={images.logo}
                className="w-[130px] h-[130px]"
                resizeMode="contain"
              />
              <Text className="text-3xl text-white font-bold text-center">
                Sign Up
              </Text>

              <FormField
                title="Full Name"
                value={form.fullName}
                handleChange={(e) =>
                  setForm({
                    ...form,
                    fullName: e,
                  })
                }
                otherStyles="mt-7"
                keyboardType="fullName-address"
              />

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
              <FormField
                title="Confirm Password"
                value={form.confirmPassword}
                handleChange={(e) =>
                  setForm({
                    ...form,
                    confirmPassword: e,
                  })
                }
                otherStyles="mt-7"
              />

              <CustomButton
                title="Sign Up"
                handlePress={handleSubmit}
                containerStyles="mt-7 w-full bg-secondary-200 min-h-[52px]"
                isLoading={isSubmitting}
              />

              <View className="justify-center pt-5 flex-row gap-2">
                <Text className="text-base text-gray-100 font-pregular">
                  Already have an account ?{" "}
                  <Link className="text-secondary-100" href={"/sign-in"}>
                    Sign In
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

export default SignUp;
