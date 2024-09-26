import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { ChatUser, CustomButton, SearchField } from "../../components";
import { Link, router, useFocusEffect } from "expo-router";
import { myAxios } from "../../helper/myAxios";
import Spinner from "../../components/Spinner";
import { Connection } from "../../types/allTypes";

let searchTimeout: NodeJS.Timeout;

const ChatUsers = () => {
  const [form, setForm] = useState({
    search: "",
  });

  const [allConnections, setAllConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(false); // For loading state

  // Function to fetch all connections
  const fetchAllConnections = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await myAxios.get(
        `/connection/get-all-connections?search=${searchQuery}`
      );
      setAllConnections(response.data.data || []);
    } catch (error: any) {
      console.log("Error fetching connections:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchAllConnections("");
    }, [])
  );

  useEffect(() => {
    if (form.search.trim() !== "") {
      clearTimeout(searchTimeout);

      searchTimeout = setTimeout(() => {
        fetchAllConnections(form.search);
      }, 500);
    } else {
      fetchAllConnections("");
    }

    return () => clearTimeout(searchTimeout);
  }, [form.search]);

  return (
    <SafeAreaView className="bg-primary h-full w-full">
      <View className="w-full items-center mt-4 border-b border-black-200 pb-1">
        <Text className="text-2xl text-white font-pbold">Chats</Text>
      </View>

      {/* Loading spinner */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Spinner />
        </View>
      ) : (
        <ScrollView className="py-1">
          {/* Search field */}
          <SearchField
            value={form.search}
            handleChange={(e) =>
              setForm({
                search: e,
              })
            }
            placeholder="Search..."
            otherStyles="mt-2 mb-4"
          />

          {/* If no connections, show message */}
          {allConnections.length === 0 ? (
            <View className="items-center mt-4 h-[50vh] justify-center">
              <Text className="text-white text-xl">
                Please connect with friends to chat.
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
            allConnections.map((connection) => (
              <Link
                key={connection.conversationId}
                href={`/message/${connection.conversationId}`}
              >
                <ChatUser
                  id={connection.user.id}
                  username={connection.user.username}
                  fullName={connection.user.fullName}
                  lastMessageAt={connection.lastMessageAt}
                  profilePic={connection.user.profilePic}
                />
              </Link>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ChatUsers;
