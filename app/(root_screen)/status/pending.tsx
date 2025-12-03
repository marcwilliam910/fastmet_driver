import LogoWithText from "@/components/LogoWithText";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PendingMessage = () => {
  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <Image
        source={require("@/assets/images/design.png")}
        style={{
          width: 150,
          height: 150,
          position: "absolute",
          right: 0,
          top: 0,
        }}
      />
      <Image
        source={require("@/assets/images/design.png")}
        style={{
          width: 150,
          height: 150,
          position: "absolute",
          left: 0,
          bottom: 0,
          transform: [{ rotate: "180deg" }],
        }}
      />

      <View className="items-center justify-around flex-1">
        <LogoWithText />

        <Text className="text-2xl font-bold tracking-wide text-secondary">
          Your account is under review
        </Text>

        <View className="w-4/5 gap-3">
          <Text className="text-center text-gray-500">
            Our team is currently verifying your submitted information.
          </Text>
          <Text className="text-center text-gray-500">
            Once approved, you will be able to accept bookings and go on duty.
          </Text>
          <Text className="text-center text-gray-500">
            We’ll notify you as soon as the review is complete.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PendingMessage;
