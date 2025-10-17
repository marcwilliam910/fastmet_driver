import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import LogoWithText from "@/components/LogoWithText";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import React, {useRef, useState} from "react";
import {Pressable, Text, TextInput, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomKeyAvoidingView>
        <View className="justify-center flex-1 gap-6 px-6">
          {/* Logo and Title */}
          <LogoWithText />

          {/* Username Input */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">Email</Text>
            <TextInput
              value={form.email}
              onChangeText={(text) => setForm({...form, email: text})}
              autoCapitalize="none"
              placeholder="Email"
              keyboardType="email-address"
              placeholderTextColor="#9CA3AF"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()} // focus password
              submitBehavior="submit" // 👈 replacement for blurOnSubmit={false}
              className={`p-4 text-base bg-gray-100 rounded-lg border border-gray-200 ${
                errors.email || errors.form ? "border border-red-500" : ""
              }`}
            />
            {errors.email && (
              <Text className="ml-2 text-xs text-red-500">{errors.email}</Text>
            )}
          </View>

          {/* Password Input */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">Password</Text>
            <View className="relative">
              <TextInput
                value={form.password}
                onChangeText={(text) => setForm({...form, password: text})}
                autoCapitalize="none"
                ref={passwordRef}
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                className={`p-4 pr-12 text-base bg-gray-100 rounded-lg border border-gray-200 ${
                  errors.password || errors.form ? "border border-red-500" : ""
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

          {/* Forgot Password */}
          <Pressable className="self-end">
            {({pressed}) => (
              <Text
                className={`text-sm font-semibold text-gray-600 ${pressed ? "underline" : ""}`}
              >
                Forgot Password?
              </Text>
            )}
          </Pressable>

          {/* Sign In Button */}
          <Pressable className="items-center py-4  rounded-lg bg-lightPrimary active:bg-darkPrimary">
            <Text className="text-base font-bold text-white">Sign In</Text>
          </Pressable>

          {/* Register Account Button */}
          <Pressable
            onPress={() => router.replace("/register")}
            className="flex-row items-center justify-center gap-1 py-4"
          >
            <Text className="font-semibold text-gray-600">
              Don't have an account?
            </Text>
            <Text className="font-semibold underline text-lightPrimary">
              Register
            </Text>
          </Pressable>
        </View>
      </CustomKeyAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
