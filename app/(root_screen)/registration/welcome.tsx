import LogoWithText from "@/components/LogoWithText";
import {Image} from "expo-image";
import React from "react";
import {Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const Welcome = () => {
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
          transform: [{rotate: "180deg"}],
        }}
      />
      <View className="items-center justify-around flex-1">
        <LogoWithText />
        <Text className="text-2xl font-bold tracking-wide text-secondary">
          Thank you for registering!
        </Text>

        <View className="w-4/5 gap-3">
          <Text className="text-center text-gray-500">
            We've received your information.
          </Text>
          <Text className="text-center text-gray-500">
            Please bear with us as we process your registration.
          </Text>
          <Text className="text-center text-gray-500">
            We'll send you an update regarding your verification schedule very
            soon. Thanks!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
