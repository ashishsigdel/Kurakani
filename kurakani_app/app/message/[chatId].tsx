import React, { useEffect, useRef, useState } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Text,
} from "react-native";
import { Redirect, useFocusEffect, useLocalSearchParams } from "expo-router";
import { BottomBar, TopBar } from "../../components";
import { User } from "../../types/allTypes";
import MessageSection from "../../components/message/MessageSection";
import { useAuth } from "../../context/GlobalProvider";
import { myAxios } from "../../helper/myAxios";
import { MessageType } from "../../types/allTypes";
import { useSocket } from "../../context/SocketContext";
import debounce from "lodash.debounce";

const Chat = () => {
  const { chatId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [friend, setFriend] = useState<User | null>(null);
  const [form, setForm] = useState({
    message: "",
  });
  const [isTyping, setIsTyping] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  // Scroll to bottom on mount or when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const { user, loading } = useAuth();

  if (!loading && !user) return <Redirect href={"/chat"} />;

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await myAxios.get(`/messages?conversationId=${chatId}`);
      setMessages(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const { socket } = useSocket();

  useEffect(() => {
    socket.on("newMessage", (newMessage: MessageType) => {
      setMessages([...messages, newMessage]);
    });
  }, [messages, setMessages, socket]);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await myAxios.get(
        `/messages/get?conversationId=${chatId}`
      );
      setFriend(response.data.data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUser();
      fetchMessages();
    }, [])
  );

  const handleChange = (e: any) => {
    setForm({ message: e });

    if (e.trim()) {
      debounceEmitTyping(true);
    } else {
      debounceEmitTyping(false);
    }
  };

  const debounceEmitTyping = debounce((typing) => {
    socket.emit(typing ? "isTyping" : "notTyping", {
      chatId,
      userId: user?.id,
      receiverId: friend?.id,
    });
  }, 500);

  const handleSend = async () => {
    if (!form.message.trim()) return; // Prevent sending empty messages

    try {
      const response = await myAxios.post("/messages/send", {
        message: form.message,
        receiverId: friend?.id,
        conversationId: chatId,
      });

      // Assuming your response includes the new message details
      const newMessage: MessageType = {
        id: response.data.data.id,
        senderId: user?.id,
        receiverId: friend?.id,
        conversationId: chatId,
        message: form.message,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        isSendByMe: true,
      };

      // Update messages state to include the new message
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Clear the input field
      setForm({ message: "" });
    } catch (error: any) {
      if (error.response?.data?.message) {
        Alert.alert("Message sending failed.", error.response.data.message);
      } else {
        Alert.alert("Message sending failed.", "Something went wrong!");
      }
    }
  };

  useEffect(() => {
    socket.on("typing", (data: any) => {
      if (chatId === data.chatId && friend?.id && friend.id === data.friendId) {
        setIsTyping(data.typing);
      }
    });

    return () => socket.off("typing");
  }, [chatId, friend?.id]);

  return (
    <SafeAreaView className="bg-primary h-full w-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <TopBar user={friend} />
        <ScrollView
          ref={scrollViewRef}
          className="pt-1 flex-1 mb-3"
          onContentSizeChange={scrollToBottom}
        >
          {isLoading ? ( // Show loading indicator
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            messages.map((message) => (
              <MessageSection key={message.id} message={message} />
            ))
          )}
          {isTyping && <Text className="text-white my-1 px-3">Typing...</Text>}
        </ScrollView>
        <BottomBar
          form={form}
          setForm={setForm}
          handleChange={handleChange}
          handleSend={handleSend}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
