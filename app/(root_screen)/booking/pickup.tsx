import BookSheet from "@/components/maps/BookSheet";
import MapScreen from "@/components/maps/MapScreen";
import SwipeArriveButton from "@/components/SwipeArriveButton";
import React from "react";
import { Dimensions, StatusBar, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PickUp() {
  const screenHeight = Dimensions.get("window").height;
  const inset = useSafeAreaInsets();

  const bottomOffset = screenHeight * 0.27 + inset.bottom;
  const isInRadius = true;
  return (
    <View
      style={{ flex: 1, backgroundColor: "white" }}
      // edges={["right", "bottom", "left"]}
    >
      <View className="relative flex-1">
        <MapScreen />
      </View>

      {isInRadius && (
        <View
          className={`w-full absolute px-2`}
          style={{ bottom: bottomOffset }}
        >
          <SwipeArriveButton onSwipe={() => {}} />
        </View>
      )}

      <BookSheet />

      <StatusBar hidden />
    </View>
  );
}
