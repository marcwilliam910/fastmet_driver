import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import RegistrationHeader from "@/components/headers/RegistrationHeader";
import {router} from "expo-router";
import {useRef} from "react";
import {Pressable, Text, TextInput, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const Step1 = () => {
  const lastNameRef = useRef<TextInput>(null);
  const middleNameRef = useRef<TextInput>(null);
  const dobRef = useRef<TextInput>(null);
  const licenseRef = useRef<TextInput>(null);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomKeyAvoidingView>
        {/* header */}
        <RegistrationHeader text="Registration Step 1" haveBack={false} />
        <View className="flex-1 gap-4 px-6 mt-4">
          {/* Inputs */}
          <View className="gap-4">
            <View className="gap-2">
              <Text className="mb-1 font-medium text-gray-600">First Name</Text>
              <TextInput
                returnKeyType="next"
                onSubmitEditing={() => middleNameRef.current?.focus()}
                submitBehavior="submit"
                placeholder="Enter name"
                placeholderTextColor="#9CA3AF"
                className="p-4 px-3 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg"
              />
            </View>

            <View className="gap-2">
              <Text className="mb-1 font-medium text-gray-600">
                Middle Name
              </Text>
              <TextInput
                ref={middleNameRef}
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current?.focus()}
                submitBehavior="submit"
                placeholder="Enter middle name"
                placeholderTextColor="#9CA3AF"
                className="p-4 px-3 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg"
              />
            </View>

            <View className="gap-2">
              <Text className="mb-1 font-medium text-gray-600">Last Name</Text>
              <TextInput
                ref={lastNameRef}
                returnKeyType="next"
                onSubmitEditing={() => dobRef.current?.focus()}
                submitBehavior="submit"
                placeholder="Enter last name"
                placeholderTextColor="#9CA3AF"
                className="p-4 px-3 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg"
              />
            </View>

            <View className="gap-2">
              <Text className="mb-1 font-medium text-gray-600">
                Date of birth
              </Text>
              <TextInput
                ref={dobRef}
                returnKeyType="next"
                onSubmitEditing={() => licenseRef.current?.focus()}
                submitBehavior="submit"
                placeholder="MM/DD/YYYY"
                keyboardType="numbers-and-punctuation"
                placeholderTextColor="#9CA3AF"
                className="p-4 px-3 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg"
              />
            </View>

            <View className="gap-2">
              <Text className="mb-1 font-medium text-gray-600">
                Driver’s License Number
              </Text>
              <TextInput
                ref={licenseRef}
                returnKeyType="done"
                placeholder="Enter driver’s License number"
                placeholderTextColor="#9CA3AF"
                className="p-4 px-3 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg"
              />
            </View>
          </View>
        </View>
        {/* Button */}
        <Pressable
          className="py-4 mx-4 mb-6 rounded-lg bg-lightPrimary active:bg-darkPrimary"
          onPress={() => router.push("/(root_screen)/registration/step2")}
        >
          <Text className="font-semibold text-center text-white">Next</Text>
        </Pressable>
      </CustomKeyAvoidingView>
    </SafeAreaView>
  );
};

export default Step1;
