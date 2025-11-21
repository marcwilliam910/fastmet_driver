import { useRequestBookingStore } from "@/store/useRequestBookingStore";
import React, { useMemo } from "react";
import { FlatList, View } from "react-native";
import { Card } from "./Regular";

export default function Pooling() {
  const incomingBooking = useRequestBookingStore((s) => s.incomingBooking);

  const poolingBookings = useMemo(() => {
    return incomingBooking.filter((b) => b.bookingType.type === "pooling");
  }, [incomingBooking]);
  return (
    <View className="flex-1 gap-5 p-4 bg-white">
      <FlatList
        data={poolingBookings}
        renderItem={({ item }) => (
          <Card
            pickup={item.pickUp.address}
            dropoff={item.dropOff.address}
            distance={item.routeData.distance}
            amount={item.routeData.price}
            isCash={item.paymentMethod === "cash"}
            services={item.addedServices}
            bookingType={item.bookingType}
            onPressSeeMore={() => {}}
          />
        )}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
          gap: 15,
        }}
      />
    </View>
  );
}
