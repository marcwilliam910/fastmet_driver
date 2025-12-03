import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import api from "@/lib/axios";
import { ProfileSchema } from "@/schemas/profileSchema";
import { useAppStore } from "@/store/useAppStore";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Platform, Pressable, Text, TextInput, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const vehicleOptions = [
  { label: "Motorcycle", value: "motorcycle" },
  { label: "Car", value: "car" },
  { label: "Van", value: "van" },
  { label: "Truck", value: "truck" },
];

const Step1 = () => {
  const emailRef = useRef<TextInput>(null);
  const licenseRef = useRef<TextInput>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    license: "",
    vehicle: "",
  });

  const name = useAppStore((s) => s.name);
  const email = useAppStore((s) => s.email);
  const vehicle = useAppStore((s) => s.vehicle);
  const license = useAppStore((s) => s.license);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    vehicle?: string;
    license?: string;
  }>({});

  const [isFocus, setIsFocus] = useState(false);
  const setLoading = useAppStore((s) => s.setLoading);

  useEffect(() => {
    setFormData({
      name,
      email,
      vehicle,
      license,
    });
  }, [name, email, vehicle, license]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    // Clear error for this field when user types
    setErrors((prev) => ({
      ...prev,
      [key]: undefined,
    }));
  };

  const handleNext = async () => {
    // Validate with Zod
    const result = ProfileSchema.safeParse(formData);

    if (!result.success) {
      // Extract errors
      const fieldErrors: any = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0]] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const driverId = useAppStore.getState().id;

    if (!driverId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Driver ID not found. Please login again.",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await api.patch(`/profile`, formData);

      if (res.data.success) {
        // Update store with new data
        useAppStore.getState().setAuthData({
          name: formData.name,
          email: formData.email,
          vehicle: formData.vehicle,
          license: formData.license,
        });

        router.push("/(root_screen)/registration/step2");
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomKeyAvoidingView>
        <View className="flex-1">
          {/* Header */}
          <View className="px-6 pt-4 pb-3 border-b border-gray-100">
            <Text className="text-2xl font-bold text-gray-800">
              Personal Information
            </Text>
            <Text className="mt-1 text-sm text-gray-500">Step 1 of 4</Text>
          </View>

          {/* Form */}
          <View className="flex-1 px-6 pt-8 gap-4">
            {/* Name */}
            <View>
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Full Name <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                value={formData.name}
                returnKeyType="next"
                onChangeText={(v) => handleChange("name", v)}
                onSubmitEditing={() => emailRef.current?.focus()}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                className={`px-4 text-gray-800 bg-gray-50 border rounded-xl ${
                  errors.name ? "border-red-500" : "border-gray-200"
                }`}
                style={{ height: Platform.OS === "ios" ? 48 : 46 }}
              />
              {errors.name && (
                <Text className="mt-1 ml-1 text-xs text-red-500">
                  {errors.name}
                </Text>
              )}
            </View>

            {/* Email */}
            <View>
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Email Address <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                ref={emailRef}
                value={formData.email}
                returnKeyType="next"
                onChangeText={(v) => handleChange("email", v)}
                onSubmitEditing={() => licenseRef.current?.focus()}
                placeholder="your.email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
                className={`px-4 text-gray-800 border rounded-xl bg-gray-50"
               ${errors.email ? "border-red-500" : "border-gray-200"}`}
                style={{ height: Platform.OS === "ios" ? 48 : 46 }}
              />

              {errors.email && (
                <Text className="mt-1 ml-1 text-xs text-red-500">
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Vehicle Dropdown */}
            <View>
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Vehicle Type <Text className="text-red-500">*</Text>
              </Text>
              <Dropdown
                data={vehicleOptions}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? "Select vehicle type" : "..."}
                value={formData.vehicle}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  handleChange("vehicle", item.value);
                  setIsFocus(false);
                }}
                style={{
                  height: Platform.OS === "ios" ? 48 : 46,
                  backgroundColor: "#F9FAFB",
                  borderColor: errors.vehicle ? "#EF4444" : "#E5E7EB",
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                }}
                placeholderStyle={{
                  fontSize: 14,
                  color: "#9CA3AF",
                }}
                selectedTextStyle={{
                  fontSize: 14,
                  color: "#1F2937",
                }}
                containerStyle={{
                  borderRadius: 12,
                  overflow: "hidden",
                }}
                itemTextStyle={{
                  fontSize: 14,
                  color: "#1F2937",
                }}
              />
              {errors.vehicle && (
                <Text className="mt-1 ml-1 text-xs text-red-500">
                  {errors.vehicle}
                </Text>
              )}
            </View>

            {/* Driver's License */}
            <View>
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Driver&apos;s License Number{" "}
                <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                ref={licenseRef}
                returnKeyType="done"
                value={formData.license}
                onChangeText={(v) => handleChange("license", v)}
                placeholder="Enter driver's license number"
                placeholderTextColor="#9CA3AF"
                className={`px-4 text-gray-800 bg-gray-50 border rounded-xl ${
                  errors.license ? "border-red-500" : "border-gray-200"
                }`}
                style={{ height: Platform.OS === "ios" ? 48 : 46 }}
              />
              {errors.license && (
                <Text className="mt-1 ml-1 text-xs text-red-500">
                  {errors.license}
                </Text>
              )}
            </View>
          </View>

          {/* Next Button */}
          <View className="px-4 pb-6">
            <Pressable
              className={`py-4 rounded-xl bg-lightPrimary active:bg-darkPrimary items-center justify-center ${
                !formData.name ||
                !formData.email ||
                !formData.vehicle ||
                !formData.license
                  ? "bg-lightPrimary/50"
                  : "bg-lightPrimary"
              }`}
              onPress={handleNext}
              disabled={
                !formData.name ||
                !formData.email ||
                !formData.vehicle ||
                !formData.license
              }
              style={{ height: Platform.OS === "ios" ? 54 : 46 }}
            >
              <Text className="text-base font-semibold text-center text-white">
                Next
              </Text>
            </Pressable>
          </View>
        </View>
      </CustomKeyAvoidingView>
    </SafeAreaView>
  );
};

export default Step1;
