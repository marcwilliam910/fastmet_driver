import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import useImage from "@/hooks/useImage";
import { useAppStore } from "@/store/useAppStore";
import { uploadAllImages } from "@/utils/imagePicker";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Step4 = () => {
  const [orUri, setOrUri] = useState<string | null>(null);
  const [crUri, setCrUri] = useState<string | null>(null);
  const [engineUri, setEngineUri] = useState<string | null>(null);
  const [chassisUri, setChassisUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const setLoading = useAppStore((s) => s.setLoading);
  const { pickImage } = useImage();

  const handleNext = async () => {
    // 1. Build validation object
    const newErrors: Record<string, string> = {};

    if (!orUri) newErrors.or = "OR is required";
    if (!crUri) newErrors.cr = "CR is required";
    if (!engineUri) newErrors.engine = "Engine is required";
    if (!chassisUri) newErrors.chassis = "Chassis is required";

    // 2. Update error state once
    setErrors(newErrors);

    // 3. Stop if any error exists
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);

      const data = await uploadAllImages(5, {
        or: orUri!,
        cr: crUri!,
        engine: engineUri!,
        chassis: chassisUri!,
      });

      if (data.success) {
        router.replace("/registration/welcome");
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
          <Text className="text-2xl font-bold text-gray-800">Documents</Text>
          <Text className="mt-1 text-sm text-gray-500">Step 4 of 4</Text>
        </View>
        <View className="flex-1 gap-6 px-6 mt-4">
          <Text className="mb-2 font-semibold text-gray-800">
            Upload OR / CR Photo
          </Text>
          <View className="gap-10">
            <View className="flex-row justify-center gap-3">
              <Card
                text="OR Photo"
                uri={orUri}
                onPress={() => pickImage(setOrUri)}
                setUri={setOrUri}
              />
              <Card
                text="CR Photo"
                uri={crUri}
                onPress={() => pickImage(setCrUri)}
                setUri={setCrUri}
              />
            </View>
            <View className="flex-row justify-center gap-3">
              <Card
                text="Engine Stencil"
                uri={engineUri}
                onPress={() => pickImage(setEngineUri)}
                setUri={setEngineUri}
              />
              <Card
                text="Chassis Stencil"
                uri={chassisUri}
                onPress={() => pickImage(setChassisUri)}
                setUri={setChassisUri}
              />
            </View>
          </View>
        </View>
        <Pressable
          onPress={handleNext}
          className={`py-4 mx-4 mb-6 rounded-lg bg-lightPrimary items-center justify-center ${
            !orUri || !crUri || !engineUri || !chassisUri
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

export default Step4;

const Card = ({
  text,
  onPress,
  uri,
  setUri,
}: {
  text: string;
  onPress: () => void;
  uri: string | null;
  setUri: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  return (
    <View className="w-[45%] gap-2 ">
      <Text className="text-sm font-medium text-center">{text}</Text>
      <Pressable
        className="items-center justify-center bg-gray-100 border border-gray-200 rounded-xl h-44 active:bg-gray-200"
        onPress={onPress}
      >
        {uri ? (
          <>
            <Image
              source={{ uri: uri }}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: 10,
              }}
            />
            <Pressable
              className="absolute -top-2 z-10 -right-1 rounded-full p-0.5 bg-red-500"
              onPress={() => setUri(null)}
            >
              <Ionicons name="close" size={16} color="white" />
            </Pressable>
          </>
        ) : (
          <Ionicons name="camera-outline" size={30} color="#9CA3AF" />
        )}
      </Pressable>
    </View>
  );
};
