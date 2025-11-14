import HeaderDrawer from "@/components/headers/HeaderDrawer";
import {Ionicons} from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import {Image} from "expo-image";
import {Drawer} from "expo-router/drawer";
import {Pressable, Text, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const CustomDrawerContent = (props: any) => {
  const inset = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <DrawerContentScrollView {...props}>
        <View className="flex-row items-center justify-center w-full gap-1 pr-5 mb-2">
          <Image
            source={require("@/assets/fastmet/logo.png")}
            style={{width: 40, height: 60}}
            contentFit="contain"
          />
          <Text className="text-lg font-bold tracking-widest text-white">
            FastMet
          </Text>
        </View>
        <DrawerItemList {...props} />
        <Pressable
          className="flex-row items-center gap-3 px-5 py-4"
          // onPress={action}
        >
          <Ionicons name={"log-out-outline"} size={24} color="white" />
          <Text className="font-semibold text-white">{"Logout"}</Text>
        </Pressable>
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={{marginBottom: inset.bottom + 10}}>
        <Text className="text-sm tracking-widest text-center text-gray-400">
          www.fastmet.com
        </Text>
      </View>
    </View>
  );
};

export default function DrawerLayout() {
  // const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <Drawer
        drawerContent={(props) => (
          <CustomDrawerContent
            {...props}
            // setIsOpen={setShowLogoutModal}
            // user={user}
          />
        )}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: "#0F2535",
          },
          drawerActiveTintColor: "#FFA840",
          drawerInactiveTintColor: "#FFFFFF",
          drawerActiveBackgroundColor: "#1a3a4f",
          drawerItemStyle: {
            borderRadius: 8,
          },

          headerStyle: {backgroundColor: "#0F2535"},
          headerLeft: () => null,
          headerTitle: ({children}) => <HeaderDrawer title={children} />,
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Home",
            title: "Home",
            drawerIcon: ({focused}) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={focused ? "#FFA840" : "#FFFFFF"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: "My Profile",
            title: "My Profile",
            // headerShown: true,
            drawerIcon: ({focused}) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color={focused ? "#FFA840" : "#FFFFFF"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="notif"
          options={{
            drawerLabel: "Notification",
            title: "Notification",
            headerShown: true,
            drawerIcon: ({focused}) => (
              <Ionicons
                name={focused ? "notifications" : "notifications-outline"}
                size={24}
                color={focused ? "#FFA840" : "#FFFFFF"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "Settings",
            title: "Settings",
            headerShown: true,
            drawerIcon: ({focused}) => (
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                size={24}
                color={focused ? "#FFA840" : "#FFFFFF"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="switch"
          options={{
            drawerLabel: "Switch Rider",
            title: "Switch Rider",
            headerShown: true,
            drawerIcon: ({focused}) => (
              <Ionicons
                name={focused ? "car" : "car-outline"}
                size={24}
                color={focused ? "#FFA840" : "#FFFFFF"}
              />
            ),
          }}
        />
      </Drawer>
      {/* <LogoutModal isOpen={showLogoutModal} setIsOpen={setShowLogoutModal} /> */}
    </>
  );
}
