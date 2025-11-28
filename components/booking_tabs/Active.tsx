import { useActiveBookings } from "@/queries/bookingQueries";
import { useAppStore } from "@/store/useAppStore";
import { formatDate } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

export default function Active() {
  const {
    data: activeBookings,
    isPending,
    error,
    refetch,
  } = useActiveBookings("123");

  if (isPending)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#FFA840" />
      </View>
    );
  if (error)
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-semibold text-gray-500">
          {error.message}
        </Text>
      </View>
    );

  return (
    <>
      {activeBookings.length === 0 ? (
        <View className="bg-white flex-1 px-8 py-12">
          <View className="items-center">
            <Ionicons
              name="information-circle-outline"
              size={80}
              color="#9CA3AF"
            />

            <Text className="text-2xl font-bold text-gray-800 mt-6 text-center">
              You have no active bookings
            </Text>

            <Text className="text-base text-gray-500 text-center mt-2">
              Please check the &quot;Requests&quot; tab to view and accept
              incoming booking requests
            </Text>
          </View>
        </View>
      ) : (
        <View className="flex-1 bg-white">
          <FlatList
            data={activeBookings}
            renderItem={({ item }) => (
              <Card
                pickup={item.pickUp.address}
                dropoff={item.dropOff.address}
                distance={item.routeData.distance}
                amount={item.routeData.price}
                isCash={item.paymentMethod === "cash"}
                bookingType={item.bookingType}
                onPress={() => {
                  useAppStore.getState().setActiveBooking(item);
                  router.push("/(root_screen)/booking/pickup");
                }}
              />
            )}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 40,
              gap: 15,
              paddingHorizontal: 20,
              paddingTop: 10,
            }}
            refreshing={isPending}
            onRefresh={refetch}
          />
        </View>
      )}
    </>
  );
}

type CardProps = {
  pickup: string;
  dropoff: string;
  distance: number;
  amount: number;
  isCash: boolean;
  bookingType: {
    type: string; // "asap" | "schedule"
    value: string | null;
  };
  onPress: () => void;
};

const Card = ({
  pickup,
  dropoff,
  distance,
  isCash,
  amount,
  bookingType,
  onPress,
}: CardProps) => {
  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden bg-white rounded-2xl active:opacity-80"
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8, // for Android
      }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3 bg-lightPrimary">
        <Text className="text-lg font-semibold text-white">
          {bookingType.type === "schedule"
            ? `Schedule: ${formatDate(bookingType.value || "")}`
            : bookingType.value}
        </Text>
      </View>

      {/* Body */}
      <View className="gap-5 px-4 py-5 ">
        {/* Pickup & Drop */}
        <View className="relative flex-row items-center justify-between ml-5 mr-2 border-l border-dashed pl-7">
          <View className="gap-4">
            <Text className="font-medium max-w-52" numberOfLines={2}>
              {pickup}
            </Text>
            <Text className="font-medium max-w-52" numberOfLines={2}>
              {dropoff}
            </Text>
          </View>
          <Text className="font-bold">{distance.toFixed(1)}km</Text>

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

        {/* Payment */}
        <View className="flex-row items-center justify-between p-4 bg-gray-100 rounded-lg">
          <Text className="text-base text-gray-600">
            {isCash ? "Cash Payment" : "Online Payment"}
          </Text>
          <Text className="text-lg font-semibold text-darkPrimary">
            Php{" "}
            {amount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>

        <Pressable
          className="items-center justify-center active:scale-105"
          onPress={onPress}
        >
          <Text className="text-sm font-medium">View on Map</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};
