import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ChatAddUser, SearchField } from "../../components";
import { icons } from "../../constants";
import { myAxios } from "../../helper/myAxios";
import { Link, router, useFocusEffect } from "expo-router";
import { User } from "../../types/allTypes";

let searchTimeout: NodeJS.Timeout; // To hold the timeout ID for debouncing

const AddFriends = () => {
  const [form, setForm] = useState({
    search: "",
  });

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [sentRequests, setSentRequests] = useState<number[]>([]);

  const fetchUsers = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await myAxios.get(
        `/users/get-random?search=${searchQuery}`
      );
      setUsers(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  useEffect(() => {
    if (form.search.trim() !== "") {
      // Clear the previous timeout when user types a new character
      clearTimeout(searchTimeout);

      // Set a new timeout to trigger search after 500ms of user inactivity
      searchTimeout = setTimeout(() => {
        fetchUsers(form.search);
      }, 500);
    } else {
      // Clear the users list if the search is empty
      setUsers([]);
    }

    // Cleanup the timeout when the component unmounts or on search input change
    return () => clearTimeout(searchTimeout);
  }, [form.search]);

  const handleRequestToggle = (userId: number) => {
    if (sentRequests.includes(userId)) {
      // Cancel request
      myAxios
        .post("/connection/add", { receiverId: userId })
        .then(() => {
          setSentRequests(sentRequests.filter((id) => id !== userId));
        })
        .catch((error) => {
          if (error.response.data.message) {
            Alert.alert("Can't delete.", error.response.data.message);
          } else {
            Alert.alert("Can't delete.", "Something went wrong!");
          }
        });
    } else {
      // Send request
      myAxios
        .post("/connection/add", { receiverId: userId })
        .then(() => {
          setSentRequests([...sentRequests, userId]);
        })
        .catch((error) => {
          if (error.response.data.message) {
            Alert.alert("Can't send", error.response.data.message);
          } else {
            Alert.alert("Can't send", "Something went wrong!");
          }
        });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUsers("");
    }, [])
  );

  return (
    <SafeAreaView className="bg-primary h-full w-full">
      <View className="w-full flex-row items-center justify-between mt-2 border-b border-black-200 pb-1 px-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={icons.leftArrow}
            className="w-[25px] h-[25px]"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text className="text-2xl text-white font-pbold text-center flex-1 -pl-[25px]">
          Add Friends
        </Text>
      </View>
      <ScrollView className="py-1">
        <SearchField
          value={form.search}
          handleChange={(e) => setForm({ search: e })}
          placeholder="Search username or name..."
          otherStyles="mt-2 mb-4"
        />
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          users.map((user) => (
            <ChatAddUser
              key={user.id}
              id={user.id}
              fullName={user.fullName}
              username={user.username}
              email={user.email}
              profilePic={user.profilePic}
              isRequestSent={sentRequests.includes(user.id)} // Pass the state
              onRequestToggle={handleRequestToggle} // Pass the handler
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddFriends;
