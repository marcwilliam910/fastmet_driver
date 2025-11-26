import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, Text, View } from "react-native";

const HeaderProfile = ({ title }: { title: string }) => {
  return (
    <View className="flex-row items-center justify-center w-full">
      {/* Left: Hamburger Menu */}
      <Pressable
        onPress={() => router.back()}
        className={`absolute ${Platform.OS === "ios" ? "-top-2 -left-2" : "-top-1 left-0"}`}
        hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
      >
        <Ionicons
          name="chevron-back"
          size={Platform.OS === "ios" ? 34 : 28}
          color="#FFA840"
        />
      </Pressable>

      {/* Center: Icon + Title */}
      <Text className="text-lg font-bold text-white">{title}</Text>
    </View>
  );
};

export default HeaderProfile;
