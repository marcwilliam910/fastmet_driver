import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import RegistrationHeader from "@/components/headers/RegistrationHeader";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Step3 = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomKeyAvoidingView>
        {/* header */}
        <RegistrationHeader text="Registration Step 3/4" haveBack={true} />
        <View className="flex-1 gap-6 px-6 mt-4">
          <Text className="mb-2 font-semibold text-gray-800">
            Upload Vehicle Photo
          </Text>
          <View className="gap-2">
            <View className="flex-row justify-center gap-3">
              <Card text="Front View" onPress={() => {}} />
              <Card text="Side Left View" onPress={() => {}} />
            </View>
            <View className="flex-row justify-center gap-3">
              <Card text="Side Right View" onPress={() => {}} />
              <Card text="Back View" onPress={() => {}} />
            </View>
          </View>
        </View>
        {/* Next Button */}
        <Pressable
          className="py-4 mx-4 mb-6 rounded-lg bg-lightPrimary"
          onPress={() => router.push("/(root_screen)/registration/step4")}
        >
          <Text className="font-semibold text-center text-white">Next</Text>
        </Pressable>
      </CustomKeyAvoidingView>
    </SafeAreaView>
  );
};

export default Step3;

const Card = ({ text, onPress }: { text: string; onPress: () => void }) => {
  return (
    <Pressable
      onPress={onPress}
      className="items-center justify-center bg-gray-100 border w-[45%] border-gray-200 rounded-xl h-44 active:bg-gray-200"
    >
      <Text className="mt-2 font-medium text-gray-400">{text}</Text>
    </Pressable>
  );
};
