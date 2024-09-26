import { View, Text, SafeAreaView, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import {
  ChatAddUser,
  CustomButton,
  FormField,
  RequestUser,
  SearchField,
  Spinner,
} from "../../components";
import { icons } from "../../constants";
import { Link, router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { RequestTypes } from "../../types/allTypes";
import { myAxios } from "../../helper/myAxios";

const Request = () => {
  const [allRequest, setAllRequest] = useState<RequestTypes[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      const response = await myAxios.get("connection/get-all-request");
      setAllRequest(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchAllRequests();
    }, [])
  );

  // Function to remove a request from the UI
  const removeRequest = (id: number) => {
    setAllRequest((prevRequests) =>
      prevRequests.filter((req) => req.id !== id)
    );
  };

  return (
    <SafeAreaView className="bg-primary h-full w-full">
      <View className="w-full flex-row items-center justify-between mt-4 border-b border-black-200 pb-1 px-3">
        <Text className="text-2xl text-white font-pbold text-center flex-1">
          Requests
        </Text>
        <Link href={"/add-friend"}>
          <Image
            source={icons.plus}
            className="w-[30px] h-[30px]"
            resizeMode="contain"
          />
        </Link>
      </View>

      {/* Loading spinner */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Spinner />
        </View>
      ) : (
        <ScrollView className="py-1">
          {/* If no connections, show message */}
          {allRequest.length === 0 ? (
            <View className="items-center mt-4 h-[50vh] justify-center">
              <Text className="text-white text-xl">
                Does not Received any connection request.
              </Text>
              <CustomButton
                title="Find Friends"
                handlePress={() => {
                  router.push("/add-friend");
                }}
                containerStyles="px-3 mt-5 bg-secondary-200 min-h-[52px]"
              />
            </View>
          ) : (
            /* List of all connections */
            allRequest.map((sender) => (
              <RequestUser
                key={sender.id}
                id={sender.id}
                message={sender.message}
                createdAt={sender.createdAt}
                sender={sender.sender}
                onRequestResponse={removeRequest}
              />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Request;
