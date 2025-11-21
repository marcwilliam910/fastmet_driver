import { useSocket } from "@/socket/context/SocketProvider";
import { toggleOnDuty } from "@/socket/handlers/booking";
import { useDutyStore } from "@/store/useDutyStore";
import { useRequestBookingStore } from "@/store/useRequestBookingStore";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { Image } from "expo-image";
import * as Location from "expo-location";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";

const HeaderTabs = () => {
  const navigation = useNavigation();
  const { onDuty, setOnDuty } = useDutyStore();
  const clearIncomingBookings = useRequestBookingStore(
    (s) => s.clearIncomingBooking
  );
  const socket = useSocket();
  const [loading, setLoading] = useState(false);

  const toggleDuty = async () => {
    if (loading) return; // ignore repeated presses
    setLoading(true);

    try {
      const newOnDuty = !onDuty;
      setOnDuty(newOnDuty); // optimistic update

      if (newOnDuty) {
        // Going ON duty - request location
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Required", "Location permission is needed.");
          setOnDuty(false); // revert to false (clearer than !newOnDuty)
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        toggleOnDuty(socket, {
          isOnDuty: newOnDuty,
          location: {
            lat: location.coords.latitude,
            long: location.coords.longitude,
          },
        });
      } else {
        // Going OFF duty - clear bookings and notify server
        clearIncomingBookings();
        toggleOnDuty(socket, { isOnDuty: newOnDuty });
      }
    } catch (error) {
      console.error("Error toggling duty:", error);
      Alert.alert("Error", "Failed to toggle duty status. Please try again.");
      setOnDuty(onDuty); // revert to original state
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-row items-center justify-between w-full">
      <View className="flex-row items-center gap-4">
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons name="menu" size={28} color="#FFA840" />
        </Pressable>

        {/* Duty toggle */}
        <Pressable
          onPress={toggleDuty}
          disabled={loading}
          className={`flex-row items-center justify-center gap-2 px-3 w-28 py-2 rounded-full ${onDuty ? "bg-white border border-lightPrimary" : "bg-gray-200"}`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFA840" />
          ) : (
            <>
              {/* Indicator */}
              <View
                className={`size-3 rounded-full ${onDuty ? "bg-lightPrimary" : "bg-gray-400"}`}
              />
              {/* Text */}

              <Text
                className={`font-semibold  ${onDuty ? "text-lightPrimary" : "text-gray-400"}`}
              >
                {onDuty ? "On Duty" : "Off Duty"}
              </Text>
            </>
          )}
        </Pressable>
      </View>

      <View>
        <Image
          source={require("@/assets/images/announcement.png")}
          style={{ width: 30, height: 30 }}
          contentFit="contain"
        />
      </View>
    </View>
  );
};

export default HeaderTabs;
