import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {FlatList, Pressable, Text, View} from "react-native";
import {DUMMY, serviceAddons} from "../request_tabs/Regular";

export default function Active() {
  return (
    <FlatList
      data={DUMMY}
      renderItem={({item}) => (
        <Card
          pickup={item.pickup}
          dropoff={item.dropoff}
          distance={item.distance}
          amount={item.amount}
          isCash={item.isCash}
          services={item.selectedServices}
          bookingType={item.bookingType}
          onPressSeeMore={() => {}}
        />
      )}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 40,
        gap: 15,
        paddingHorizontal: 20,
        paddingTop: 10,
      }}
    />
  );
}

type CardProps = {
  pickup: string;
  dropoff: string;
  distance: string;
  amount: number;
  isCash: boolean;
  services: typeof serviceAddons;
  bookingType: string;
  onPressSeeMore: () => void;
};

const Card = ({
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
    <Pressable
      onPress={onPressSeeMore}
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
        <Text className="text-lg font-semibold text-white">{bookingType}</Text>
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
            <Text className="font-medium max-w-60" numberOfLines={2}>
              {pickup}
            </Text>
            <Text className="font-medium max-w-60" numberOfLines={2}>
              {dropoff}
            </Text>
          </View>
          <Text className="font-bold">{distance}</Text>

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
            Php {amount.toLocaleString("en-US")}
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
  );
};
