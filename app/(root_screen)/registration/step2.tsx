import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import RegistrationHeader from "@/components/headers/RegistrationHeader";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import {Pressable, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const Step2 = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomKeyAvoidingView>
        {/* header */}
        <RegistrationHeader text="Registration Step 2" haveBack={true} />
        <View className="flex-1 gap-6 px-6 mt-4">
          {/* Upload Selfie */}
          <View className="gap-2">
            <Text className="mb-2 font-semibold text-gray-800">
              Upload Selfie Photo
            </Text>
            <Pressable className="items-center justify-center bg-gray-100 border border-gray-200 rounded-xl h-44 active:bg-gray-200">
              <Ionicons name="scan-outline" size={70} color="#9CA3AF" />
              <Ionicons
                name="person-outline"
                size={30}
                color="#9CA3AF"
                className="absolute top-[48px]"
              />
              <Text className="mt-2 font-medium text-gray-400">
                Upload Selfie Photo
              </Text>
            </Pressable>
          </View>

          {/* Upload with License */}
          <View className="gap-2">
            <Text className="mb-2 font-semibold text-gray-800">
              Upload Selfie Photo with driver’s license
            </Text>

            <Pressable className="items-center justify-center gap-2 bg-gray-100 border border-gray-200 rounded-xl h-44 active:bg-gray-200">
              <Ionicons name="scan-outline" size={70} color="#9CA3AF" />

              <Ionicons
                name="card-outline"
                size={30}
                color="#9CA3AF"
                className="absolute top-[48px]"
              />
              <Text className="px-4 font-medium text-center text-gray-400">
                Upload Selfie Photo with driver’s license
              </Text>
            </Pressable>
          </View>
        </View>
        {/* Next Button */}
        <Pressable
          className="py-4 mx-4 mb-6 rounded-lg bg-lightPrimary"
          onPress={() => router.push("/(root_screen)/registration/step3")}
        >
          <Text className="font-semibold text-center text-white">Next</Text>
        </Pressable>
      </CustomKeyAvoidingView>
    </SafeAreaView>
  );
};

export default Step2;
