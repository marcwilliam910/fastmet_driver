import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SeeMoreModal from "../modals/seeMoreModal";
import { DUMMY } from "../request_tabs/Regular";
import SwipeArriveButton from "../SwipeArriveButton";
import SheetButton from "./SheetButton";

const BookSheet = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = Dimensions.get("window");

  const pickup =
    "Pickup Location Pickup Location Pickup Location Pickup Location";
  const dropoff =
    "Dropoff Location Pickup LocationPickup Location vPickup Location";
  const distance = 12;

  const [sheetIndex, setSheetIndex] = useState(1);
  const [bottomOffset, setBottomOffset] = useState(0);

  const [isSeeMoreModalVisible, setIsSeeMoreModalVisible] = useState(false);

  const isInRadius = false;

  // snap points
  const snapPoints = useMemo(() => {
    const first = 0.13 * screenHeight + insets.bottom;
    const second = 0.27 * screenHeight + insets.bottom;
    return [first, second];
  }, [insets.bottom, screenHeight]);

  // update button position when sheet changes
  useEffect(() => {
    setBottomOffset(snapPoints[sheetIndex]);
  }, [sheetIndex, snapPoints]);

  return (
    <>
      {/* Swipe Button */}
      {isInRadius && (
        <View
          className={`w-full absolute px-2`}
          style={{ bottom: bottomOffset }}
        >
          <SwipeArriveButton onSwipe={() => {}} />
        </View>
      )}

      {/* Sheet */}
      <BottomSheet
        ref={sheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={setSheetIndex}
        enableDynamicSizing={false}
        handleIndicatorStyle={{ backgroundColor: "#FFA840" }}
        containerStyle={{ zIndex: 20 }}
        enableContentPanningGesture={false}
      >
        <BottomSheetView className="flex-1 px-3">
          <View className="gap-5">
            {/* Header */}
            <View className="items-center justify-center">
              <Text className="font-semibold text-lg text-gray-900">
                John Doe
              </Text>
            </View>

            {/* Pickup / Dropoff */}
            <View className="relative flex-row items-center justify-between ml-5 mr-2 border-l border-dashed pl-7">
              <View className="gap-4">
                <Text className="font-medium max-w-52" numberOfLines={1}>
                  {pickup}
                </Text>
                <Text className="font-medium max-w-52" numberOfLines={1}>
                  {dropoff}
                </Text>
              </View>

              <Text className="font-bold">{distance}km</Text>

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
          </View>
        </BottomSheetView>
      </BottomSheet>

      <SheetButton onDetailsPress={() => setIsSeeMoreModalVisible(true)} />

      <SeeMoreModal
        visible={isSeeMoreModalVisible}
        onClose={() => setIsSeeMoreModalVisible(false)}
        data={DUMMY[0]}
        onPress={() => {}}
        isAccepted={true}
      />
    </>
  );
};

export default BookSheet;
