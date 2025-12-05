import { useAuth } from "@/hooks/useAuth";
import { useDriverCompletedBookings } from "@/queries/bookingQueries";
import { Booking } from "@/types/booking";
import { formatDate } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import SeeMoreModal from "../modals/seeMoreModal";

export default function Completed() {
  const { id } = useAuth();
  const [selectedData, setSelectedData] = useState<Booking | null>(null);

  const [modalVisible, setModalVisible] = useState(false);

  const handleSeeMorePress = (request: Booking) => {
    setSelectedData(request);
    setModalVisible(true);
  };

  const {
    data,
    isPending,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDriverCompletedBookings(id!, 5);

  if (isPending)
    return (
      <View className="flex-1 items-center bg-white justify-center">
        <ActivityIndicator size="large" color="#FFA840" />
      </View>
    );
  if (error)
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg font-semibold text-gray-500">
          {error.message}
        </Text>
      </View>
    );

  const completedBookings = data?.pages.flatMap((page) => page.bookings) ?? [];

  return (
    <>
      <FlatList
        data={completedBookings}
        renderItem={({ item }) => (
          <Card
            pickup={item.pickUp.address}
            dropoff={item.dropOff.address}
            distance={item.routeData.distance}
            amount={item.routeData.price}
            isCash={item.paymentMethod === "cash"}
            bookingType={item.bookingType}
            onPressSeeMore={() => handleSeeMorePress(item)}
          />
        )}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        className="flex-1 p-4 bg-white"
        contentContainerStyle={{
          paddingBottom: 40,
          gap: 15,
        }}
        ListEmptyComponent={() => (
          <View className=" items-center justify-center px-8 py-12">
            <View className="items-center">
              <Ionicons name="alert-circle-outline" size={80} color="#9CA3AF" />
              <Text className="text-2xl font-bold text-gray-800 mt-6 text-center">
                No Requests Yet
              </Text>
              <Text className="text-base text-gray-500 text-center mt-2">
                You currently don&apos;t have any active requests.
              </Text>
            </View>
          </View>
        )}
        // pull to refresh
        refreshing={isPending}
        onRefresh={refetch}
        // infinite scroll
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.3}
        // Loading indicator at bottom
        ListFooterComponent={() => {
          if (isFetchingNextPage) {
            return (
              <View className="py-4">
                <ActivityIndicator size="small" color="#FFA840" />
              </View>
            );
          }
          return null;
        }}
      />

      {selectedData && (
        <SeeMoreModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          data={selectedData}
          isAccepted={true}
        />
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
  onPressSeeMore: () => void;
};

const Card = ({
  pickup,
  dropoff,
  distance,
  isCash,
  amount,
  bookingType,
  onPressSeeMore,
}: CardProps) => {
  return (
    <View
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8, // for Android
      }}
      className="rounded-2xl"
    >
      <Pressable
        className="overflow-hidden bg-white rounded-2xl active:opacity-80"
        onPress={onPressSeeMore}
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
        </View>
      </Pressable>
    </View>
  );
};
