import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SheetButton({
  onDetailsPress,
}: {
  onDetailsPress: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row justify-evenly items-center px-5 py-3 bg-white z-30"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        // bottom: insets.bottom + 10, // respect safe area
        bottom: 0,

        paddingBottom: insets.bottom + 5,
      }}
    >
      <View className="items-center justify-center gap-1">
        <Pressable
          className="bg-lightPrimary rounded-full p-2 active:scale-105"
          onPress={onDetailsPress}
        >
          <Ionicons name="information-circle-sharp" size={24} color="white" />
        </Pressable>
        <Text className="text-sm font-semibold">Full Details</Text>
      </View>
      <View className="items-center justify-center gap-1">
        <View className="bg-lightPrimary rounded-full p-2">
          <Ionicons name="call-sharp" size={24} color="white" />
        </View>
        <Text className="text-sm font-semibold">Contact Customer</Text>
      </View>
    </View>
  );
}
