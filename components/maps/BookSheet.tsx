import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useMemo, useRef } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BookSheet = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = Dimensions.get("window");
  const pickup =
    "Pickup Location Pickup Location Pickup Location Pickup Location";
  const dropoff =
    "Dropoff Location Pickup LocationPickup Location vPickup Location";
  const distance = 12;

  // take consideration the inset bottom
  const snapPoints = useMemo(() => {
    const first = 0.27 * screenHeight + insets.bottom;
    // const second = 0.6 * screenHeight + insets.bottom;

    return [first];
  }, [insets.bottom, screenHeight]);

  return (
    <>
      <BottomSheet
        ref={sheetRef}
        // index={1}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        handleIndicatorStyle={{ backgroundColor: "#FFA840" }}
        enableContentPanningGesture={false} // 👈 This is the key
        containerStyle={{ zIndex: 20 }}
      >
        <BottomSheetView className="flex-1 px-3">
          <View className="gap-5">
            <View className="items-center justify-center">
              <Pressable
                onPress={() => router.back()}
                className="absolute left-0"
              >
                <Ionicons
                  name="chevron-back-outline"
                  size={28}
                  color="#FFA840"
                />
              </Pressable>
              <Text className="font-semibold text-lg text-gray-900">
                John Doe
              </Text>
            </View>

            <View className="relative flex-row items-center justify-between ml-5 mr-2 border-l border-dashed pl-7">
              <View className="gap-4">
                <Text className="font-medium max-w-52" numberOfLines={1}>
                  {pickup}
                </Text>
                <Text className="font-medium max-w-52" numberOfLines={1}>
                  {dropoff}
                </Text>
              </View>
              <Text className="font-bold">{distance}km</Text>

              <Ionicons
                name="location-sharp"
                size={24}
                className="absolute -left-3.5 -top-1 bg-white"
              />
              <Ionicons
                name="locate-sharp"
                size={24}
                className="absolute -left-3.5 -bottom-1 bg-white"
              />
            </View>

            <View className="flex-row justify-evenly items-center">
              <View className="items-center justify-center gap-1">
                <View className="bg-lightPrimary rounded-full p-2">
                  <Ionicons
                    name="information-circle-sharp"
                    size={24}
                    color="white"
                  />
                </View>
                <Text className="text-sm font-semibold">Details</Text>
              </View>
              <View className="items-center justify-center gap-1">
                <View className="bg-lightPrimary rounded-full p-2">
                  <Ionicons name="call-sharp" size={24} color="white" />
                </View>
                <Text className="text-sm font-semibold">Contact Customer</Text>
              </View>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

export default BookSheet;
