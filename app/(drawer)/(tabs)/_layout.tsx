import HeaderTabs from "@/components/headers/HeaderTabs";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";

export default function TabLayout() {
  const incomingBookingCount = useAppStore(
    (state) => state.incomingBooking.length
  );
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#0F2535",
          // height: 60, // Increase from default (~50px)
          // paddingTop: 5, // Add bottom padding
        },
        tabBarActiveTintColor: "#FFA840",
        tabBarInactiveTintColor: "#9FABB4",
        headerShown: true,
        headerStyle: { backgroundColor: "#0F2535" },
        headerTitle: () => <HeaderTabs />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          title: "Booking",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="chats"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, focused }) => (
            <View>
              <Ionicons
                name={focused ? "chatbubbles" : "chatbubbles-outline"}
                size={24}
                color={color}
              />
              {/* <View className="absolute flex items-center justify-center bg-red-500 rounded-full size-4 -top-1 -right-2">
                <Text className="text-xs font-semibold text-white">4</Text>
              </View> */}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="request"
        options={{
          title: "Request",
          tabBarIcon: ({ color, focused }) => (
            <View>
              <Ionicons
                name={focused ? "car" : "car-outline"}
                size={24}
                color={color}
              />
              {incomingBookingCount > 0 && (
                <View className="absolute flex items-center justify-center bg-red-500 rounded-full size-4 -top-1 -right-2">
                  <Text className="text-xs font-semibold text-white">
                    {incomingBookingCount > 9 ? "9+" : incomingBookingCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="earnings"
        options={{
          title: "Earnings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "wallet" : "wallet-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
