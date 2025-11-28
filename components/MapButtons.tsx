import { useAppStore } from "@/store/useAppStore";
import { MAX_LOCATION_RADIUS_KM } from "@/utils/constants";
import { calculateDistance } from "@/utils/distanceCalculator";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";
import SwipeButton from "rn-swipe-button";

export default function MapButtonsWrapper() {
  const driverLocation = useAppStore((s) => s.driverLocation);
  const activeBooking = useAppStore((s) => s.activeBooking);
  const isDriving = useAppStore((s) => s.isDriving);

  if (!isDriving) return null; // Do not show button unless in drive mode
  if (!driverLocation || !activeBooking) return null;

  const pickupLocation = {
    lat: activeBooking.pickUp.coords.lat,
    lng: activeBooking.pickUp.coords.lng,
  };

  const distance = calculateDistance(
    { lat: driverLocation.lat, lng: driverLocation.lng },
    pickupLocation
  );

  const isInRadius = distance <= MAX_LOCATION_RADIUS_KM;

  return (
    <View className={`w-full px-2`}>
      {isInRadius ? (
        <SwipeArriveButton onSwipe={() => {}} />
      ) : (
        <StopDrivingButton />
      )}
    </View>
  );
}

function SwipeArriveButton({ onSwipe }: { onSwipe: () => void }) {
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

function StopDrivingButton() {
  const setIsDriving = useAppStore((s) => s.setIsDriving);

  return (
    <View>
      <Pressable
        onPress={() => setIsDriving(false)}
        className={`p-4 self-end rounded-2xl bg-red-500 `}
      >
        <Ionicons
          name="stop"
          size={24}
          color="white"
          className="animate-pulse"
        />
      </Pressable>
    </View>
  );
}
