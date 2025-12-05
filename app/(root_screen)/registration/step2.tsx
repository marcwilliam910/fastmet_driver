import { useAppStore } from "@/store/useAppStore";
import { pickImage, uploadAllImages } from "@/utils/imagePicker";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Step2 = () => {
  const router = useRouter();
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [selfieWithLicenseUri, setSelfieWithLicenseUri] = useState<
    string | null
  >(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const setLoading = useAppStore((s) => s.setLoading);

  const handleNext = async () => {
    // 1. Build validation object
    const newErrors: Record<string, string> = {};

    if (!selfieUri) {
      newErrors.selfie = "Selfie is required";
    }

    if (!selfieWithLicenseUri) {
      newErrors.selfieWithLicense = "Selfie with license is required";
    }

    // 2. Update error state once
    setErrors(newErrors);

    // 3. Stop if any error exists
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);

      const data = await uploadAllImages(3, {
        selfie: selfieUri!,
        selfieWithLicense: selfieWithLicenseUri!,
      });

      if (data.success) {
        router.replace("/registration/step3");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* header */}
      <View className="px-6 pt-4 pb-3 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-800">License</Text>
        <Text className="mt-1 text-sm text-gray-500">Step 2 of 4</Text>
      </View>

      <View className="flex-1 gap-6 px-6 mt-4">
        {/* Upload Selfie */}
        <View className="gap-2">
          <Text className="mb-2 font-semibold text-gray-800">
            Upload Selfie Photo
          </Text>
          <Pressable
            className={`items-center justify-center bg-gray-100 border border-gray-200 rounded-xl h-44 active:bg-gray-200 ${errors.selfie ? "border-red-500" : ""}`}
            onPress={() => pickImage(setSelfieUri)}
          >
            {selfieUri ? (
              <Image
                source={{ uri: selfieUri }}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: 10,
                }}
              />
            ) : (
              <>
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
              </>
            )}
          </Pressable>
          {errors.selfie && (
            <Text className="mt-1 ml-1 text-xs text-red-500">
              {errors.selfie}
            </Text>
          )}
        </View>

        {/* Upload with License */}
        <View className="gap-2">
          <Text className="mb-2 font-semibold text-gray-800">
            Upload Selfie Photo with driver&apos;s license
          </Text>
          <Pressable
            className={`items-center justify-center gap-2 bg-gray-100 border border-gray-200 rounded-xl h-44 active:bg-gray-200 ${errors.selfieWithLicense ? "border-red-500" : ""}`}
            onPress={() => pickImage(setSelfieWithLicenseUri)}
          >
            {selfieWithLicenseUri ? (
              <Image
                source={{ uri: selfieWithLicenseUri }}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: 10,
                }}
              />
            ) : (
              <>
                <Ionicons name="scan-outline" size={70} color="#9CA3AF" />
                <Ionicons
                  name="card-outline"
                  size={30}
                  color="#9CA3AF"
                  className="absolute top-[48px]"
                />
                <Text className="px-4 font-medium text-center text-gray-400">
                  Upload Selfie Photo with driver&apos;s license
                </Text>
              </>
            )}
          </Pressable>
          {errors.selfieWithLicense && (
            <Text className="mt-1 ml-1 text-xs text-red-500">
              {errors.selfieWithLicense}
            </Text>
          )}
        </View>
      </View>

      {/* Next Button */}
      <Pressable
        disabled={!selfieUri || !selfieWithLicenseUri}
        className={`py-4 mx-4 mb-6 rounded-lg bg-lightPrimary items-center justify-center ${
          !selfieUri || !selfieWithLicenseUri
            ? "bg-lightPrimary/50"
            : "bg-lightPrimary"
        }`}
        style={{ height: Platform.OS === "ios" ? 54 : 46 }}
        onPress={handleNext}
      >
        <Text className="font-semibold text-center text-white">Next</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Step2;
