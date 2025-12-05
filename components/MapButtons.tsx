import { useSocket } from "@/socket/context/SocketProvider";
import { bookingComplete } from "@/socket/handlers/booking";
import { useAppStore } from "@/store/useAppStore";
import { MAX_LOCATION_RADIUS_KM } from "@/utils/constants";
import { calculateDistance } from "@/utils/distanceCalculator";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";
import Toast from "react-native-toast-message";
import SwipeButton from "rn-swipe-button";

export default function MapButtonsWrapper({
  showCompleteModal,
}: {
  showCompleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const driverLocation = useAppStore((s) => s.driverLocation);
  const activeBooking = useAppStore((s) => s.activeBooking);
  const isDriving = useAppStore((s) => s.isDriving);
  const setIsDriving = useAppStore((s) => s.setIsDriving);
  const setNavigationStage = useAppStore((s) => s.setNavigationStage);
  const navigationStage = useAppStore((s) => s.navigationStage);
  const socket = useSocket();

  if (!isDriving) return null; // Do not show button unless in drive mode
  if (!driverLocation || !activeBooking) return null;

  const location = {
    lat:
      navigationStage === "TO_PICKUP"
        ? activeBooking.pickUp.coords.lat
        : activeBooking.dropOff.coords.lat,
    lng:
      navigationStage === "TO_PICKUP"
        ? activeBooking.pickUp.coords.lng
        : activeBooking.dropOff.coords.lng,
  };

  const distance = calculateDistance(
    { lat: driverLocation.lat, lng: driverLocation.lng },
    location
  );
  const isInRadius = distance <= MAX_LOCATION_RADIUS_KM;

  return (
    <View className={`w-full px-2`}>
      {isInRadius ? (
        <SwipeArriveButton
          stage={navigationStage}
          onSwipe={async () => {
            const isPickup = navigationStage === "TO_PICKUP";
            const title = isPickup ? "Arrived at Pick Up" : "Booking Completed";
            const subtitle = isPickup
              ? "You have arrived at your destination"
              : "You have successfully completed the booking";

            Toast.show({
              type: "success",
              text1: title,
              text2: subtitle,
              position: "bottom",
              visibilityTime: 7000,
              swipeable: true,
              bottomOffset: 130,
            });

            setIsDriving(false);

            if (isPickup) {
              setNavigationStage("TO_DROPOFF");
            } else {
              showCompleteModal(true);
              bookingComplete(socket, activeBooking._id);
            }
          }}
        />
      ) : (
        <StopDrivingButton />
      )}
    </View>
  );
}

function SwipeArriveButton({
  onSwipe,
  stage,
}: {
  onSwipe: () => void;
  stage: "TO_PICKUP" | "TO_DROPOFF";
}) {
  return (
    <SwipeButton
      title={`Arrived at ${stage === "TO_PICKUP" ? "Pick Up" : "Drop Off"}`}
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
