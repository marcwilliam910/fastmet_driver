import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import RegistrationHeader from "@/components/headers/RegistrationHeader";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import React from "react";
import {Pressable, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const Step4 = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomKeyAvoidingView>
        {/* header */}
        <RegistrationHeader text="Registration Step 4" haveBack={true} />

        <View className="flex-1 gap-6 px-6 mt-4">
          <Text className="mb-2 font-semibold text-gray-800">
            Upload OR / CR Photo
          </Text>
          <View className="gap-10">
            <View className="flex-row justify-center gap-3">
              <Card text="OR Photo" onPress={() => {}} />
              <Card text="CR Photo" onPress={() => {}} />
            </View>
            <View className="flex-row justify-center gap-3">
              <Card text="Engine Stencil" onPress={() => {}} />
              <Card text="Chasis Stencil" onPress={() => {}} />
            </View>
          </View>
        </View>
        <Pressable
          className="py-4 mx-4 mb-6 rounded-lg bg-lightPrimary"
          onPress={() => router.push("/(root_screen)/registration/welcome")}
        >
          <Text className="font-semibold text-center text-white">Next</Text>
        </Pressable>
      </CustomKeyAvoidingView>
    </SafeAreaView>
  );
};

export default Step4;

const Card = ({text, onPress}: {text: string; onPress: () => void}) => {
  return (
    <View className="w-[45%] gap-2 ">
      <Text className="text-sm font-medium text-center">{text}</Text>
      <Pressable
        className="items-center justify-center bg-gray-100 border border-gray-200 rounded-xl h-44 active:bg-gray-200"
        onPress={onPress}
      >
        <Ionicons name="add" size={30} color="#9CA3AF" />
      </Pressable>
    </View>
  );
};
