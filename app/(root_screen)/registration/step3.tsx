import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import { useAppStore } from "@/store/useAppStore";
import { pickImage, uploadAllImages } from "@/utils/imagePicker";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Step3 = () => {
  const [frontViewUri, setFrontViewUri] = useState<string | null>(null);
  const [sideLeftViewUri, setSideLeftViewUri] = useState<string | null>(null);
  const [sideRightViewUri, setSideRightViewUri] = useState<string | null>(null);
  const [backViewUri, setBackViewUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const setLoading = useAppStore((s) => s.setLoading);

  const handleNext = async () => {
    // 1. Build validation object
    const newErrors: Record<string, string> = {};

    if (!frontViewUri) newErrors.frontView = "Front view is required";
    if (!sideLeftViewUri) newErrors.sideLeftView = "Side left view is required";
    if (!sideRightViewUri)
      newErrors.sideRightView = "Side right view is required";
    if (!backViewUri) newErrors.backView = "Back view is required";

    // 2. Update error state once
    setErrors(newErrors);

    // 3. Stop if any error exists
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);

      const data = await uploadAllImages(4, {
        frontView: frontViewUri!,
        sideLeftView: sideLeftViewUri!,
        sideRightView: sideRightViewUri!,
        backView: backViewUri!,
      });

      if (data.success) {
        router.replace("/registration/step4");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomKeyAvoidingView>
        {/* header */}
        <View className="px-6 pt-4 pb-3 border-b border-gray-100">
          <Text className="text-2xl font-bold text-gray-800">Vehicle</Text>
          <Text className="mt-1 text-sm text-gray-500">Step 3 of 4</Text>
        </View>
        <View className="flex-1 gap-6 px-6 mt-4">
          <Text className="mb-2 font-semibold text-gray-800">
            Upload Vehicle Photo
          </Text>
          <View className="gap-2">
            <View className="flex-row justify-center gap-3">
              <Card
                text="Front View"
                onPress={() => pickImage(setFrontViewUri)}
                uri={frontViewUri}
              />
              <Card
                text="Side Left View"
                onPress={() => pickImage(setSideLeftViewUri)}
                uri={sideLeftViewUri}
              />
            </View>
            <View className="flex-row justify-center gap-3">
              <Card
                text="Side Right View"
                onPress={() => pickImage(setSideRightViewUri)}
                uri={sideRightViewUri}
              />
              <Card
                text="Back View"
                onPress={() => pickImage(setBackViewUri)}
                uri={backViewUri}
              />
            </View>
          </View>
        </View>
        {/* Next Button */}
        <Pressable
          onPress={handleNext}
          className={`py-4 mx-4 mb-6 rounded-lg bg-lightPrimary items-center justify-center ${
            !frontViewUri ||
            !sideLeftViewUri ||
            !sideRightViewUri ||
            !backViewUri
              ? "bg-lightPrimary/50"
              : "bg-lightPrimary"
          }`}
          style={{ height: Platform.OS === "ios" ? 54 : 46 }}
        >
          <Text className="font-semibold text-center text-white">Next</Text>
        </Pressable>
      </CustomKeyAvoidingView>
    </SafeAreaView>
  );
};

export default Step3;

const Card = ({
  text,
  onPress,
  uri,
}: {
  text: string;
  onPress: () => void;
  uri: string | null;
}) => {
  return (
    <View className="w-[45%] gap-2 ">
      <Text className="text-sm font-medium text-center">{text}</Text>

      <Pressable
        className="items-center justify-center bg-gray-100 border border-gray-200 rounded-xl h-44 active:bg-gray-200"
        onPress={onPress}
      >
        {uri ? (
          <Image
            source={{ uri: uri }}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: 10,
            }}
          />
        ) : (
          <Ionicons name="camera-outline" size={30} color="#9CA3AF" />
        )}
      </Pressable>
    </View>
  );
};
