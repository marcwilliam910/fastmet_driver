import {Image} from "expo-image";
import React from "react";
import {Text, View} from "react-native";

export default function LogoWithText() {
  return (
    <View className="items-center mb-5 gap-3">
      <Image
        source={require("@/assets/fastmet/logo.png")}
        style={{width: 120, height: 90}}
        contentFit="contain"
      />
      <Text className="text-2xl font-medium tracking-widest text-secondary">
        FastMet Driver App
      </Text>
    </View>
  );
}
