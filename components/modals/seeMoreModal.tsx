import { useSocket } from "@/socket/context/SocketProvider";
import { useAppStore } from "@/store/useAppStore";
import { Booking } from "@/types/booking";
import { formatDate } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function SeeMoreModal({
  visible,
  setModalVisible = () => {},
  onClose,
  data,
  onPress,
  isAccepted,
}: {
  visible: boolean;
  setModalVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  data: Booking;
  onPress?: () => void;
  isAccepted: boolean;
}) {
  const insets = useSafeAreaInsets();
  const socket = useSocket();
  const setLoading = useAppStore((state) => state.setLoading);

  // for confirm booking
  useEffect(() => {
    const onConfirmed = ({ bookingId }: { bookingId: string }) => {
      console.log("✔ Booking accepted:", bookingId);
      setModalVisible(false);
      router.push("/(root_screen)/booking/directions");
      setLoading(false);
    };

    if (!isAccepted) socket.on("acceptanceConfirmed", onConfirmed);

    return () => {
      if (!isAccepted) socket.off("acceptanceConfirmed", onConfirmed);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAccepted, setLoading, setModalVisible]);

  // for error booking
  useEffect(() => {
    const onAcceptError = (data: { message: string }) => {
      console.log("❌ ACCEPT BOOKING FAILED:", data.message);
      setLoading(false);

      Toast.show({
        type: "error",
        text1: "Oops! Booking Already Taken",
        text2: data.message,
        position: "top",
        visibilityTime: 10_000,
        swipeable: true,
        topOffset: 50,
      });
      router.replace("/(drawer)/(tabs)/request");
    };

    if (!isAccepted) socket.on("acceptBookingError", onAcceptError);

    return () => {
      if (!isAccepted) socket.off("acceptBookingError", onAcceptError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAccepted, setLoading]);

  if (!data) return null;

  const totalServicesPrice = data.addedServices.reduce(
    (total, service) => total + service.price,
    0
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent={true} // Add this for Android
    >
      <View
        style={{
          flex: 1,
          paddingTop: insets.top, // respect status bar / notch
          paddingBottom: insets.bottom,
          backgroundColor: "white",
        }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-center px-4 pt-2 pb-4">
          <Pressable
            onPress={onClose}
            className="absolute left-4 top-1"
            hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
          >
            <Ionicons
              name="chevron-back-outline"
              size={Platform.OS === "ios" ? 34 : 28}
              color="#FFA840"
            />
          </Pressable>
          <Text className="text-lg font-semibold uppercase">
            {data.bookingType.type}
          </Text>
        </View>

        {/* Content - Scrollable */}
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 20, paddingBottom: 30 }}
        >
          {/* Location Details */}
          <View className="p-5 bg-gray-50 rounded-2xl">
            <Text className="mb-4 text-base font-semibold text-gray-800">
              Trip Details
            </Text>

            <View className="relative flex-row items-center justify-between ml-5 mr-2 border-l border-dashed border-lightPrimary pl-7">
              <View className="gap-4">
                <Text className="text-sm font-medium max-w-60">
                  {data.pickUp.address.includes(data.pickUp.name)
                    ? data.pickUp.address
                    : data.pickUp.name + ", " + data.pickUp.address}
                </Text>
                <Text className="text-sm font-medium max-w-60">
                  {data.dropOff.address.includes(data.dropOff.name)
                    ? data.dropOff.address
                    : data.dropOff.name + ", " + data.dropOff.address}
                </Text>
              </View>

              <Ionicons
                name="location-sharp"
                size={24}
                color={"#FFA840"}
                className="absolute -left-3.5 -top-1 bg-gray-50"
              />
              <Ionicons
                name="locate-sharp"
                size={24}
                color={"#FFA840"}
                className="absolute -left-3.5 -bottom-1 bg-gray-50 "
              />
            </View>
            {/* Distance */}
            <View className="flex-row items-center justify-between p-3 mt-4 bg-white rounded-lg">
              <Text className="text-sm text-gray-600">Distance</Text>
              <Text className="text-lg font-bold text-lightPrimary">
                {data.routeData.distance.toFixed(2)}km
              </Text>
            </View>

            {/* Booking Type */}
            <View className="flex-row items-center justify-between p-3 mt-0 bg-white rounded-lg">
              <Text className="text-sm font-bold text-gray-600">
                {data.bookingType.type === "schedule"
                  ? "Schedule"
                  : data.bookingType.value}
              </Text>
              {data.bookingType.type === "schedule" && (
                <Text className="text-sm font-bold text-gray-600">
                  {formatDate(data.bookingType.value || "")}
                </Text>
              )}
            </View>
          </View>

          {/* Payment Info */}
          <View className="p-5 bg-gray-50 rounded-2xl">
            <Text className="mb-3 text-base font-semibold text-gray-800">
              Payment Information
            </Text>
            <View className="flex-row items-center justify-between p-4 bg-white rounded-xl">
              <View className="flex-row items-center">
                <Ionicons
                  name={
                    data.paymentMethod === "cash"
                      ? "cash-outline"
                      : "card-outline"
                  }
                  size={22}
                  color="#666"
                />
                <Text className="ml-3 text-base text-gray-600">
                  {data.paymentMethod === "cash"
                    ? "Cash Payment"
                    : "Online Payment"}
                </Text>
              </View>
              <Text className="text-xl font-bold text-darkPrimary">
                Php{" "}
                {data.routeData.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          </View>

          {/* Selected Services */}
          {data.addedServices && data.addedServices.length > 0 && (
            <View className="p-5 bg-gray-50 rounded-2xl">
              <Text className="mb-3 text-base font-semibold text-gray-800">
                Selected Services ({data.addedServices.length})
              </Text>
              <View className="gap-2">
                {data.addedServices.map((service: any) => (
                  <View
                    key={service.id}
                    className="flex-row items-center justify-between p-4 bg-white rounded-xl"
                  >
                    <View className="flex-row items-center flex-1">
                      <Text className="mr-3 text-2xl">{service.icon}</Text>
                      <Text className="text-base text-gray-800">
                        {service.name}
                      </Text>
                    </View>
                    <Text className="font-semibold text-lightPrimary">
                      ₱{service.price}
                    </Text>
                  </View>
                ))}
              </View>

              <View className="flex-row items-center justify-between px-4 pt-4 rounded-xl">
                <Text className="text-base font-semibold text-gray-800">
                  Total
                </Text>
                <Text className="font-semibold text-lightPrimary">
                  {totalServicesPrice > 0
                    ? `Php ${totalServicesPrice.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : "FREE"}
                </Text>
              </View>
            </View>
          )}

          {/* Note */}
          {data.note && (
            <View className="p-5 bg-amber-50 rounded-2xl">
              <View className="flex-row items-center mb-2">
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#FFA840"
                />
                <Text className="ml-2 text-base font-semibold text-gray-800">
                  Note
                </Text>
              </View>
              <Text className="leading-5 text-gray-700">{data.note}</Text>
            </View>
          )}

          {/* Images */}
          {data.images && data.images.length > 0 && (
            <View className="p-5 bg-gray-50 rounded-2xl">
              <View className="flex-row items-center mb-3">
                <Ionicons name="image-outline" size={20} color="#666" />
                <Text className="ml-2 text-base font-semibold text-gray-800">
                  Attached Images ({data.images.length})
                </Text>
              </View>
              <View className="flex-row justify-between">
                {data.images.map((img: any, index: number) => (
                  <View
                    key={index}
                    className="items-center justify-center bg-gray-200 rounded-xl"
                    style={{ width: 95, height: 95 }}
                  >
                    <Text className="text-gray-500">Image {index + 1}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {!isAccepted && (
            <Pressable
              className="items-center justify-center py-3 mx-4 rounded-lg bg-lightPrimary active:bg-darkPrimary"
              onPress={onPress}
            >
              <Text className="text-lg font-bold text-white">
                Accept Booking
              </Text>
            </Pressable>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
