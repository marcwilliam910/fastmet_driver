import Carousel from "@/components/Carousel";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

const Home = () => {
  const date = useMemo(() => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  return (
    <ScrollView
      className="relative flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Carousel />

      {/* Active Request */}
      <View className="px-4 mt-5 gap-7">
        <View className="gap-6 p-4 bg-lightPrimary rounded-2xl">
          <View className="flex-row items-center gap-2 ">
            <Ionicons name="car" size={22} color="white" />
            <Text className="text-lg font-semibold text-white ">
              Active Request
            </Text>
          </View>

          <View className="flex-row justify-between ">
            {["Regular", "Bidding", "Pooling"].map((label) => (
              <View key={label} className="items-center flex-1 gap-1">
                <Text className="text-xl font-bold text-white">00</Text>
                <Text className="font-medium text-white">{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Summary cards */}
        <View className="flex-row flex-wrap justify-between gap-y-4">
          <Card text="Date" icon="calendar" subtext={date} />
          <Card text="Pick up target" icon="cube" subtext="1 / 3" />
          <Card text="Income" icon="cash" subtext="Php 8,000" />
          <Card text="Income target" icon="bar-chart" subtext="Php 10,000" />
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;

const Card = ({
  text,
  icon,
  subtext,
}: {
  text: string;
  icon: string;
  subtext: string;
}) => {
  return (
    <View className="bg-gray-100 w-[48%] rounded-2xl p-3 shadow-sm gap-5">
      <View className="flex-row items-center gap-2">
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={18}
          color="#FFA840"
        />
        <Text className="text-sm font-semibold text-gray-700">{text}</Text>
      </View>
      <Text className="font-bold text-center text-gray-900">{subtext}</Text>
    </View>
  );
};
