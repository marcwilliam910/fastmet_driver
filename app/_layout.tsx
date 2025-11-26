import LoadingModal from "@/components/modals/loading";
import { toastConfig } from "@/config/toastConfig";
import { queryClient } from "@/lib/queryClient";
import SocketProvider from "@/socket/context/SocketProvider";
import {
  Montserrat_400Regular,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import { QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const isLoggedIn = true;

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // // bypass TS check
      // (Text as any).defaultProps = (Text as any).defaultProps || {};
      // (Text as any).defaultProps.style = {
      //   fontFamily: "Montserrat_400Regular",
      // };

      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <SocketProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Protected guard={!isLoggedIn}>
                <Stack.Screen name="(auth)" />
              </Stack.Protected>

              <Stack.Protected guard={isLoggedIn}>
                <Stack.Screen name="(drawer)" />
              </Stack.Protected>

              <Stack.Screen name="(root_screen)" />
            </Stack>
            <Toast config={toastConfig} />
            <LoadingModal />
          </SocketProvider>
        </QueryClientProvider>
        <StatusBar backgroundColor="#0F2535" barStyle="light-content" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
