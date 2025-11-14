import {Ionicons} from "@expo/vector-icons";
import {DrawerActions} from "@react-navigation/native";
import {Image} from "expo-image";
import {useNavigation} from "expo-router";
import React, {useState} from "react";
import {Pressable, Text, View} from "react-native";

const HeaderTabs = () => {
  const navigation = useNavigation();
  const [onDuty, setOnDuty] = useState(false);

  const toggleDuty = () => {
    setOnDuty((prev) => !prev);
    // Optionally call your backend update duty status here
  };

  return (
    <View className="flex-row items-center justify-between w-full">
      <View className="flex-row items-center gap-4">
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons name="menu" size={28} color="#FFA840" />
        </Pressable>

        {/* Duty toggle */}
        <Pressable
          onPress={toggleDuty}
          className={`flex-row items-center gap-2 px-3 py-2 rounded-full ${onDuty ? "bg-white border border-lightPrimary" : "bg-gray-200"}`}
        >
          {/* Indicator */}
          <View
            className={`size-3 rounded-full ${onDuty ? "bg-lightPrimary" : "bg-gray-400"}`}
          />
          {/* Text */}
          <Text
            className={`font-semibold ${onDuty ? "text-lightPrimary" : "text-gray-400"}`}
          >
            {onDuty ? "On Duty" : "Off Duty"}
          </Text>
        </Pressable>
      </View>

      <View>
        <Image
          source={require("@/assets/images/announcement.png")}
          style={{width: 30, height: 30}}
          contentFit="contain"
        />
      </View>
    </View>
  );
};

export default HeaderTabs;
