import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function BookingLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar hidden />
    </>
  );
}
