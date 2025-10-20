import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import LogoWithText from "@/components/LogoWithText";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import React, {useRef, useState} from "react";
import {Pressable, Text, TextInput, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const Register = () => {
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomKeyAvoidingView>
        <View className="justify-center flex-1 gap-4 px-6 pt-6">
          <LogoWithText />

          <View className="gap-4">
            {/* Mobile Number */}
            <View className="gap-2">
              <Text className="text-sm font-medium text-gray-700 ">
                Mobile Number
              </Text>

              <View className="flex-row items-center px-3 bg-gray-100 border border-gray-200 rounded-lg">
                <Text className="pr-2 mr-2 text-gray-600 border-r-2 border-lightPrimary">
                  +63
                </Text>
                <TextInput
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()} // focus password
                  submitBehavior="submit" // 👈 replacement for blurOnSubmit={false}
                  keyboardType="numeric"
                  placeholder="Enter mobile number"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 py-4 text-gray-800"
                />
              </View>
            </View>

            {/* Email Address */}
            <View className="gap-2">
              <Text className="text-sm font-medium text-gray-700 ">
                Email Address
              </Text>

              <TextInput
                ref={emailRef}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()} // focus password
                submitBehavior="submit" // 👈 replacement for blurOnSubmit={false}
                placeholder="Email Address"
                keyboardType="email-address"
                placeholderTextColor="#9CA3AF"
                className="p-4 px-3 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg"
              />
            </View>

            {/* Password Input */}
            <View className="gap-2">
              <Text className="text-sm font-medium text-gray-700">
                Password
              </Text>
              <View className="relative">
                <TextInput
                  autoCapitalize="none"
                  placeholder="Password"
                  ref={passwordRef}
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  className={`p-4 pr-12 text-base bg-gray-100 rounded-lg border  ${
                    errors.password || errors.form
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5"
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={22}
                    color="#9CA3AF"
                  />
                </Pressable>
              </View>
              {errors.password && (
                <Text className="ml-2 text-xs text-red-500">
                  {errors.password}
                </Text>
              )}
            </View>

            {/* Location */}
            <View className="gap-2">
              <Text className="text-sm font-medium text-gray-700 ">
                Location
              </Text>
              <TextInput
                value="Metro Manila"
                editable={false}
                className="p-4 px-3 text-gray-500 bg-gray-100 border border-gray-200 rounded-lg"
              />
            </View>

            {/* Terms Checkbox */}
            <View className="flex-row justify-center gap-2 mt-2">
              <Ionicons
                name={checked ? "checkbox" : "square-outline"}
                size={22}
                color={checked ? "#FF8A00" : "gray"}
                onPress={() => setChecked(!checked)}
              />
              <Text className=" text-gray-600 text-sm text-center max-w-[80%]">
                I agree to FastMet{" "}
                <Text className="font-semibold text-lightPrimary">
                  Terms and Conditions
                </Text>{" "}
                and{" "}
                <Text className="font-semibold text-lightPrimary">
                  Privacy Policy
                </Text>
              </Text>
            </View>

            {/* Button */}
            <Pressable
              disabled={!checked}
              className={`mt-4 py-4 rounded-lg bg-lightPrimary active:bg-darkPrimary ${
                checked ? "" : "opacity-70"
              }`}
              onPress={() => router.push("/(root_screen)/registration/step1")}
            >
              <Text className="font-semibold text-center text-white">
                Register Account
              </Text>
            </Pressable>
          </View>

          {/* Login Account Button */}
          <Pressable
            onPress={() => router.replace("/login")}
            className="flex-row items-center justify-center gap-1 mt-3 "
          >
            <Text className="font-semibold text-gray-600">
              Already have an account?
            </Text>
            <Text className="font-semibold underline text-lightPrimary">
              Sign in
            </Text>
          </Pressable>
        </View>
      </CustomKeyAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
