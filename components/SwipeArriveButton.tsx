import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import SwipeButton from "rn-swipe-button";

export default function SwipeArriveButton({
  onSwipe,
}: {
  onSwipe: () => void;
}) {
  return (
    <SwipeButton
      title="Arrived at location"
      titleStyles={{
        fontSize: 17,
        fontWeight: "700",
        color: "#FFFFFF",
        paddingLeft: 20,
      }}
      railBackgroundColor="#616060"
      railBorderColor="transparent"
      railFillBackgroundColor="#FFA840"
      railFillBorderColor="transparent"
      thumbIconBackgroundColor="#FFA840"
      thumbIconStyles={{
        borderRadius: 8,
      }}
      thumbIconBorderColor="transparent"
      thumbIconComponent={() => (
        <View className="flex-row items-center justify-center w-full h-full">
          <Ionicons name="chevron-forward" size={26} color="#FFFFFF" />
          <Ionicons
            name="chevron-forward"
            size={26}
            color="#FFFFFF"
            style={{ marginLeft: -16 }}
          />
          <Ionicons
            name="chevron-forward"
            size={26}
            color="#FFFFFF"
            style={{ marginLeft: -16 }}
          />
        </View>
      )}
      onSwipeSuccess={onSwipe}
      containerStyles={{
        borderRadius: 10,
        overflow: "hidden",
      }}
      height={50}
      railStyles={{
        borderRadius: 10,
      }}
    />
  );
}
