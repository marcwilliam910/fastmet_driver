import { useSocket } from "@/socket/context/SocketProvider";
import { acceptBooking } from "@/socket/handlers/booking";
import { useAppStore } from "@/store/useAppStore";
import { Booking, Services } from "@/types/booking";
import { formatDate } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import Popover, { PopoverPlacement } from "react-native-popover-view";
import SeeMoreModal from "../modals/seeMoreModal";

export default function Regular() {
  const [selectedFilters, setSelectedFilters] = useState(["ASAP", "SCHEDULE"]);
  const [modalVisible, setModalVisible] = useState(false);
  const setLoading = useAppStore((state) => state.setLoading);
  const [selectedRequest, setSelectedRequest] = useState<Booking | null>(null);
  const incomingBooking = useAppStore((state) => state.incomingBooking);
  const onDuty = useAppStore((state) => state.onDuty);
  const setActiveBooking = useAppStore((state) => state.setActiveBooking);
  const socket = useSocket();

  const regularBookings = useMemo(() => {
    return incomingBooking.filter((b) => b.bookingType.type !== "pooling");
  }, [incomingBooking]);

  const filteredBookings = useMemo(() => {
    return regularBookings.filter((b) =>
      selectedFilters.includes(b.bookingType.type.toUpperCase())
    );
  }, [regularBookings, selectedFilters]);

  const handleSeeMorePress = (request: any) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const handleAcceptBooking = () => {
    if (!selectedRequest) return;
    setActiveBooking(selectedRequest);

    const payload = {
      bookingId: selectedRequest._id,
      driverData: {
        id: useAppStore.getState().id!,
        name: useAppStore.getState().name!,
        rating: 4.5,
      },
    };
    setLoading(true);
    acceptBooking(socket, payload);
  };

  const handleFilterPress = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      if (selectedFilters.length === 1) return;
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };
  return (
    <>
      {regularBookings.length === 0 ? (
        <View className="bg-white flex-1 px-8 py-12">
          <View className="items-center">
            <Ionicons
              name="information-circle-outline"
              size={80}
              color="#9CA3AF"
            />

            <Text className="text-2xl font-bold text-gray-800 mt-6 text-center">
              No Incoming Requests
            </Text>

            <Text className="text-base text-gray-500 text-center mt-2">
              {onDuty ? (
                "You are on duty. New booking requests will appear here."
              ) : (
                <>
                  Switch to{" "}
                  <Text className="font-bold text-lightPrimary"> On Duty </Text>{" "}
                  mode to start receiving booking requests.
                </>
              )}
            </Text>
          </View>
        </View>
      ) : (
        <>
          <View className="flex-1 gap-5 px-4 bg-white">
            <View className="flex-row items-center justify-between gap-3 pt-3 pb-0 mx-3">
              <Text className="font-bold">
                {selectedFilters.length === 2
                  ? selectedFilters.join(" and ")
                  : selectedFilters[0]}
              </Text>
              <Popover
                placement={PopoverPlacement.LEFT}
                from={
                  <Pressable>
                    <Ionicons name="options" size={28} color="black" />
                  </Pressable>
                }
              >
                <View className="w-40">
                  <View className="px-2 py-2 bg-lightPrimary ">
                    <Text className="text-lg font-bold text-white">Filter</Text>
                  </View>
                  {["ASAP", "SCHEDULE"].map((option) => (
                    <Pressable
                      onPress={() => handleFilterPress(option)}
                      key={option}
                      className="flex-row items-center justify-between p-3 active:scale-105"
                    >
                      <Text className="font-semibold">{option}</Text>
                      {
                        // Check if the option is selected
                        selectedFilters.includes(option) ? (
                          <Ionicons name="checkbox" size={24} color="#FFA840" />
                        ) : (
                          <Ionicons name="square" size={24} color="#999" />
                        )
                      }
                    </Pressable>
                  ))}
                </View>
              </Popover>
            </View>

            <FlatList
              data={filteredBookings}
              renderItem={({ item }) => (
                <Card
                  pickup={item.pickUp.address}
                  dropoff={item.dropOff.address}
                  distance={item.routeData.distance}
                  amount={item.routeData.price}
                  isCash={item.paymentMethod === "cash"}
                  services={item.addedServices}
                  bookingType={item.bookingType}
                  onPressSeeMore={() => handleSeeMorePress(item)}
                />
              )}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 40,
                gap: 15,
              }}
              ListEmptyComponent={() => (
                <View className="flex-1 items-center justify-center px-6 py-12">
                  <Ionicons name="cube-outline" size={60} color="#9CA3AF" />
                  <Text className="text-xl font-semibold text-gray-800 mt-4 text-center">
                    No Active Requests
                  </Text>
                  <Text className="text-gray-500 mt-2 text-center">
                    There are currently no delivery or pickup requests assigned
                    to you.
                  </Text>
                </View>
              )}
            />
          </View>

          {selectedRequest && (
            <SeeMoreModal
              visible={modalVisible}
              setModalVisible={setModalVisible}
              onClose={() => setModalVisible(false)}
              data={selectedRequest}
              onPress={handleAcceptBooking}
              isAccepted={false}
            />
          )}
        </>
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
  services: Services[];
  bookingType: {
    type: string; // "asap" | "schedule"
    value: string | null;
  };
  onPressSeeMore: () => void;
};

export const Card = ({
  pickup,
  dropoff,
  distance,
  isCash,
  amount,
  bookingType,
  services,
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
        onPress={onPressSeeMore}
        className="overflow-hidden bg-white rounded-2xl active:opacity-80"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3 bg-lightPrimary">
          <Text className="text-lg font-semibold text-white">
            {bookingType.type === "schedule"
              ? `Schedule: ${formatDate(bookingType.value || "")}`
              : bookingType.value}
          </Text>
          {/* <Pressable
          className="flex-row items-center gap-2 active:scale-105"
        //   onPress={() => router.push("/(root_screens)/booking/viewOnMap")}
        >
          <Text className="text-sm font-semibold text-white underline">
            View on Map
          </Text>
          <Ionicons name="arrow-forward" size={16} color="white" />
        </Pressable> */}
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

          {/* services adds on emojis*/}
          <View className="gap-2">
            <Text className="font-semibold text-gray-600">
              Services adds on:
            </Text>
            <View className="flex-row flex-wrap items-center gap-2 px-2">
              {services.map((service, index) => (
                <View
                  key={index}
                  className="items-center justify-center p-1 border border-gray-400 rounded-md size-10"
                >
                  <Text className="text-lg">{service.icon}</Text>
                </View>
              ))}
            </View>
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
            onPress={onPressSeeMore}
          >
            <Text className="text-sm font-medium">+ See more</Text>
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
};
