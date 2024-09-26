import axios, { AxiosInstance } from "axios";
import { decryptAccessToken, encryptAccessToken } from "./Helper";
import apiURL from "../constants/apiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking } from "react-native";

export const baseUrl = `${apiURL}/api/v1`;

const myAxios: AxiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshAccessToken = async () => {
  try {
    const storedToken = await AsyncStorage.getItem("accessToken");
    const accessToken = decryptAccessToken(storedToken || "");
    if (!accessToken) {
      throw new Error("No access token found");
    }
    const response = await axios.post(
      `${apiURL}/api/v1/auth/refresh-token`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    const newAccessToken: string = response.data.data.accessToken;
    const encryptedAccessToken: string = encryptAccessToken(newAccessToken);
    await AsyncStorage.setItem("accessToken", encryptedAccessToken);
    return newAccessToken;
  } catch (error: any) {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("user");
    // Use Linking to open the login screen
    Linking.openURL("/sign-in");
  }
};

myAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const byPassUrls = [
      "/auth/login",
      "/auth/refresh-token",
      "/auth/register",
      "/reset-password/forgot-password",
    ];
    const dynamicBypassPatterns = [/blogs\/slug\/.*/];
    function isBypassUrl(url: string): boolean {
      if (byPassUrls.includes(url)) return true;
      for (const pattern of dynamicBypassPatterns) {
        if (pattern.test(url)) return true;
      }
      return false;
    }
    if (error.config && isBypassUrl(error.config.url)) throw error;
    if (error.response && error.response.status === 401) {
      const newAccessToken = await refreshAccessToken();
      const originalRequest = error.config;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return myAxios(originalRequest);
    }
    throw error;
  }
);

myAxios.interceptors.request.use(async (config) => {
  const storedToken = await AsyncStorage.getItem("accessToken");
  if (storedToken) {
    const decryptedToken = decryptAccessToken(storedToken);
    config.headers.Authorization = `Bearer ${decryptedToken}`;
  }
  return config;
});

export { myAxios };
