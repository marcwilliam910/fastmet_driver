import MapButtonsWrapper from "@/components/MapButtons";
import MapScreen from "@/components/maps/MapScreen";
import ExitMapModal from "@/components/modals/exitMapModal";
import SeeMoreModal from "@/components/modals/seeMoreModal";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import { usePreventRemove } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { BackHandler, Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Directions() {
  const [showExitModal, setShowExitModal] = useState(false);

  const [isSeeMoreModalVisible, setIsSeeMoreModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const activeBooking = useAppStore((s) => s.activeBooking);

  // 1. Prevent screen removal (for both platforms)
  usePreventRemove(!showExitModal, () => {
    setShowExitModal(true);
  });

  // 2. Android hardware back override
  useEffect(() => {
    if (Platform.OS !== "android") return;

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setShowExitModal(true);
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View className="relative flex-1">
        <MapScreen />
      </View>

      {/* Buttons */}
      <View
        className="gap-1 items-center"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <MapButtonsWrapper />

        <View
          className="flex-row justify-evenly items-center px-5 py-3 w-full bg-white z-30 rounded-t-3xl "
          style={{ paddingBottom: insets.bottom + 5 }}
        >
          <View className="items-center justify-center gap-1">
            <Pressable
              className="bg-lightPrimary rounded-full p-2 active:scale-105"
              onPress={() => setIsSeeMoreModalVisible(true)}
            >
              <Ionicons
                name="information-circle-sharp"
                size={24}
                color="white"
              />
            </Pressable>
            <Text className="text-sm font-semibold">Full Details</Text>
          </View>
          <View className="items-center justify-center gap-1">
            <View className="bg-lightPrimary rounded-full p-2">
              <Ionicons name="call-sharp" size={24} color="white" />
            </View>
            <Text className="text-sm font-semibold">Contact Customer</Text>
          </View>
        </View>
      </View>

      {activeBooking && (
        <SeeMoreModal
          visible={isSeeMoreModalVisible}
          onClose={() => setIsSeeMoreModalVisible(false)}
          data={activeBooking}
          onPress={() => {}}
          isAccepted={true}
        />
      )}

      <ExitMapModal
        visible={showExitModal}
        onCancel={() => setShowExitModal(false)}
        onConfirm={() => {
          useAppStore.getState().setIsDriving(false);
          router.replace("/(drawer)/(tabs)/booking");
        }}
      />
    </View>
  );
}
