import BookSheet from "@/components/maps/BookSheet";
import MapScreen from "@/components/maps/MapScreen";
import React from "react";
import { StatusBar, View } from "react-native";

export default function PickUp() {
  return (
    <View
      style={{ flex: 1, backgroundColor: "white" }}
      // edges={["right", "bottom", "left"]}
    >
      <View className="relative flex-1">
        <MapScreen />
      </View>

      {/* {isInRadius && (
        <View
          className={`w-full absolute px-2`}
          style={{ bottom: bottomOffset }}
        >
          <SwipeArriveButton onSwipe={() => {}} />
        </View>
      )} */}

      <BookSheet />

      <StatusBar hidden />
    </View>
  );
}
