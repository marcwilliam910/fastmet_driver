import { useSocket } from "@/socket/context/SocketProvider";
import { toggleOnDuty, updateLocation } from "@/socket/handlers/duty";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { Image } from "expo-image";
import * as Location from "expo-location";
import { useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const HeaderTabs = () => {
  const navigation = useNavigation();
  const onDuty = useAppStore((state) => state.onDuty);
  const isDriving = useAppStore((state) => state.isDriving);
  const clearIncomingBookings = useAppStore((s) => s.clearIncomingBooking);
  const activeBooking = useAppStore((s) => s.activeBooking);
  const socket = useSocket();
  const [loading, setLoading] = useState(false);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  const toggleDuty = async () => {
    if (activeBooking && onDuty) {
      // show error warning saying you have active booking, if you off duty there will be consequences or something
      Toast.show({
        type: "error",
        text1: "You have an active booking",
        text2: "Please complete your active booking before going off duty",
        position: "top",
        visibilityTime: 7_000,
        swipeable: true,
        topOffset: 50,
      });
      return;
    }

    if (loading) return; // ignore repeated presses
    setLoading(true);

    try {
      const newOnDuty = !onDuty;

      if (newOnDuty) {
        // Going ON duty - request location
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Required", "Location permission is needed.");
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        toggleOnDuty(socket, {
          isOnDuty: newOnDuty,
          location: {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const startWatching = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Location permission not granted");
          return;
        }

        // ✅ Watch position with custom options
        subscriptionRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 30_000,
            distanceInterval: 800,
          },
          (location) => {
            const newLocation = {
              lat: location.coords.latitude,
              lng: location.coords.longitude,
            };

            updateLocation(socket, newLocation); // Send location update to backend
          }
        );
      } catch (error) {
        console.error("Error starting location watch:", error);
      }
    };

    if (onDuty && !isDriving) {
      startWatching();
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onDuty, isDriving]);

  return (
    <View className="flex-row items-center justify-between w-full">
      <View className="flex-row items-center gap-4">
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
        >
          <Ionicons
            name="menu"
            size={Platform.OS === "ios" ? 34 : 28}
            color="#FFA840"
          />
        </Pressable>

        {/* Duty toggle */}
        <Pressable
          onPress={toggleDuty}
          disabled={loading}
          className={`flex-row items-center justify-center gap-2 px-3 w-28 py-2 rounded-full h-10 active:scale-105 ${onDuty ? "bg-white border border-lightPrimary" : "bg-gray-200"}`}
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
