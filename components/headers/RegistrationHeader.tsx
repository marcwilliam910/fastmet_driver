import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import React from "react";
import {Pressable, Text, View} from "react-native";

const RegistrationHeader = ({
  text,
  haveBack,
}: {
  text: string;
  haveBack?: boolean;
}) => {
  return (
    <View className="relative">
      <Text className="py-5 text-xl font-bold text-center text-gray-900">
        {text}
      </Text>
      {haveBack && (
        <Pressable
          className="absolute top-5 left-5"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={25} color="#FFA840" />
        </Pressable>
      )}
    </View>
  );
};

export default RegistrationHeader;
