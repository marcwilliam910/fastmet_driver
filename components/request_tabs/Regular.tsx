import {Ionicons} from "@expo/vector-icons";
import React, {useState} from "react";
import {FlatList, Pressable, Text, View} from "react-native";
import Popover, {PopoverPlacement} from "react-native-popover-view";
import SeeMoreModal from "../modals/seeMoreModal";

export const serviceAddons = [
  {id: "3", name: "Small Truck", price: 100, icon: "🚚"},
  {id: "4", name: "Safety Shoes", price: 100, icon: "👞"},
  {
    id: "5",
    name: "1 Extra Helper",
    price: 100,
    icon: "🧑",
  },
  {id: "6", name: "Reflector Vest", price: 50, icon: "🦺"},
  {id: "7", name: "Extra Space", price: 60, icon: "📦"},
  {id: "8", name: "Fire Extinguisher", price: 30, icon: "🧯"},
  {id: "9", name: "Document Print", price: 100, icon: "📄"},
  {id: "10", name: "FastMet ID", price: 200, icon: "🪪"},
];

export const DUMMY = [
  {
    id: "1",
    pickup: "1234 Long Address St. Brgy. Name, City Name, Province Name, 1234",
    dropoff:
      "5678 Another Long Address Ave. Brgy. Different, City Name, Province Name, 5678",
    distance: "12 km",
    amount: 1500,
    isCash: true,
    selectedServices: serviceAddons,
    bookingType: "ASAP",
    note: "I need to get to the airport",
    images: [1, 2, 3],
  },
  // {
  //   id: "2",
  //   pickup: "1234 Long Address St. Brgy. Name, City Name, Province Name, 1234",
  //   dropoff:
  //     "5678 Another Long Address Ave. Brgy. Different, City Name, Province Name, 5678",
  //   distance: "12 km",
  //   amount: 1500,
  //   isCash: true,
  //   services: serviceAddons,
  //   bookingType: "ASAP",
  // },
  // {
  //   id: "3",
  //   pickup: "1234 Long Address St. Brgy. Name, City Name, Province Name, 1234",
  //   dropoff:
  //     "5678 Another Long Address Ave. Brgy. Different, City Name, Province Name, 5678",
  //   distance: "12 km",
  //   amount: 1500,
  //   isCash: true,
  //   services: serviceAddons,
  //   bookingType: "ASAP",
  // },
  // {
  //   id: "4",
  //   pickup: "1234 Long Address St. Brgy. Name, City Name, Province Name, 1234",
  //   dropoff:
  //     "5678 Another Long Address Ave. Brgy. Different, City Name, Province Name, 5678",
  //   distance: "12 km",
  //   amount: 1500,
  //   isCash: true,
  //   services: serviceAddons,
  //   bookingType: "ASAP",
  // },
];

export default function Regular() {
  const [selectedFilters, setSelectedFilters] = useState(["ASAP", "Schedule"]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleSeeMorePress = (request: any) => {
    setSelectedRequest(request);
    setModalVisible(true);
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
              {["ASAP", "Schedule"].map((option) => (
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
              onPressSeeMore={() => handleSeeMorePress(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 40,
            gap: 15,
          }}
        />
      </View>

      <SeeMoreModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        data={selectedRequest}
      />
    </>
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

        {/* services adds on emojis*/}
        <View className="gap-2">
          <Text className="font-semibold text-gray-600">Services adds on:</Text>
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
