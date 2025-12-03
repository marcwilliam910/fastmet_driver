import HeaderProfile from "@/components/headers/HeaderProfile";
import SocketProvider from "@/socket/context/SocketProvider";
import { Stack } from "expo-router";

export default function RootScreenLayout() {
  return (
    <SocketProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0F2535" },
          headerLeft: () => null,
          headerBackVisible: false, // <- disables built-in back
          headerTitle: ({ children }) => <HeaderProfile title={children} />,
        }}
      >
        <Stack.Screen
          name="message"
          options={{ title: "Message", headerShown: false }}
        />
        <Stack.Screen
          name="help&support"
          options={{
            title: "Help and Support",
          }}
        />
        <Stack.Screen
          name="fileReport"
          options={{
            title: "File a Report",
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            title: "About Us",
          }}
        />
        {/* <Stack.Screen
        name="notifViewer"
        options={{
          title: "Notification",
        }}
      /> */}
        {/* <Stack.Screen
        name="profile-register"
        options={{
          headerShown: false,
          title: "Profile Registration",
        }}
      /> */}
        <Stack.Screen
          name="registration"
          options={{
            title: "Book",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="status"
          options={{
            title: "Status",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="booking"
          options={{
            title: "Booking",
            headerShown: false,
          }}
        />
      </Stack>
    </SocketProvider>
  );
}
