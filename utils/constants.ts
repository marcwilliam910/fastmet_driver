import { Platform } from "react-native";

export const GOOGLE_MAPS_API_KEY =
  Platform.OS === "ios"
    ? process.env.EXPO_PUBLIC_IOS_MAP_KEY
    : process.env.EXPO_PUBLIC_ANDROID_MAP_KEY;

export const STATIC_IMAGES = {
  pickup: require("@/assets/images/pickup.png"),
  dropoff: require("@/assets/images/dropoff.png"),
};
