import { queryClient } from "@/lib/queryClient";
import { useAppStore } from "@/store/useAppStore";
import { STATIC_IMAGES } from "@/utils/constants";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Modal, Platform, Pressable, Text, View } from "react-native";

export default function BookingCompleteModal({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const activeBooking = useAppStore((state) => state.activeBooking);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl w-full max-w-sm p-6 items-center">
          {/* Image */}
          <Image
            source={STATIC_IMAGES.bookingComplete}
            style={{ width: 100, height: 100 }}
            className="mb-4"
            contentFit="contain"
          />

          {/* Title */}
          <Text className="text-2xl font-bold text-center mb-2">
            Booking Completed!
          </Text>

          {/* Subtitle */}
          <Text className="text-center text-gray-600 mb-4">
            You have successfully completed your booking.
          </Text>

          {/* Price / Earnings */}
          {activeBooking?.routeData?.price && (
            <Text className="text-center text-lg font-semibold text-green-600 mb-6">
              Earned: ₱{activeBooking.routeData.price.toFixed(2)}
            </Text>
          )}

          {/* Button */}
          <Pressable
            className="bg-lightPrimary rounded-xl py-3 px-6 w-full items-center justify-center"
            style={{ height: Platform.OS === "ios" ? 50 : 46 }}
            onPress={() => {
              setVisible(false);
              router.replace("/(drawer)/(tabs)");
              // Invalidate activeBooking
              queryClient.invalidateQueries({
                queryKey: ["activeBooking"],
              });
              // Invalidate completedBookings
              queryClient.invalidateQueries({
                queryKey: ["completedBookings", useAppStore.getState().id],
              });

              setTimeout(() => {
                useAppStore.getState().clearActiveBooking();
              }, 1500);
            }}
          >
            <Text className="text-white text-center font-bold">Go to Home</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
