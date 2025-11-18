import MapScreen from "@/components/maps/MapScreen";
import ExitMapModal from "@/components/modals/exitMapModal";
import SeeMoreModal from "@/components/modals/seeMoreModal";
import { DUMMY } from "@/components/request_tabs/Regular";
import SwipeArriveButton from "@/components/SwipeArriveButton";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { BackHandler, Pressable, StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PickUp() {
  const [showExitModal, setShowExitModal] = useState(false);

  const isInRadius = false;
  const [isSeeMoreModalVisible, setIsSeeMoreModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const backAction = () => {
      // Always block back button
      setShowExitModal(true); // always show modal

      return true;
    };

    const handler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => handler.remove();
  }, []);

  return (
    <View
      style={{ flex: 1, backgroundColor: "white" }}
      // edges={["right", "bottom", "left"]}
    >
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
        {isInRadius && (
          <View className={`w-full px-2`}>
            <SwipeArriveButton onSwipe={() => {}} />
          </View>
        )}
        <View
          className="flex-row justify-evenly items-center px-5 py-3 w-full bg-white z-30"
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

      <SeeMoreModal
        visible={isSeeMoreModalVisible}
        onClose={() => setIsSeeMoreModalVisible(false)}
        data={DUMMY[0]}
        onPress={() => {}}
        isAccepted={true}
      />

      <ExitMapModal
        visible={showExitModal}
        onCancel={() => setShowExitModal(false)}
        onConfirm={() => router.back()}
      />

      <StatusBar hidden />
    </View>
  );
}
