import LoadingModal from "@/components/modals/loading";
import { toastConfig } from "@/config/toastConfig";
import { useAuth } from "@/hooks/useAuth";
import { queryClient } from "@/lib/queryClient";
import { useAppStore } from "@/store/useAppStore";
import {
  Montserrat_400Regular,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import { QueryClientProvider } from "@tanstack/react-query";
import { router, SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isLoggedIn, hasHydrated } = useAuth();

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (!isLoggedIn || !hasHydrated || !fontsLoaded) return;

    // 👇 Get state once without subscribing
    const { approvalStatus, registrationStep } = useAppStore.getState();
    const isApproved = approvalStatus === "approved";

    // User is logged in, now route them based on their state
    if (isApproved) {
      router.replace("/(drawer)/(tabs)");
    } else if (registrationStep) {
      // Route based on registration step (like handleVerifySuccess)
      switch (registrationStep) {
        case 1:
          router.replace("/(root_screen)/registration/step1");
          break;
        case 2:
          router.replace("/(root_screen)/registration/step2");
          break;
        case 3:
          router.replace("/(root_screen)/registration/step3");
          break;
        case 4:
          router.replace("/(root_screen)/registration/step4");
          break;
        case 5:
          router.replace("/(root_screen)/registration/welcome");
          break;
        default:
          if (approvalStatus === "pending") {
            router.replace("/(root_screen)/status/pending");
          } else if (approvalStatus === "rejected") {
            router.replace("/(root_screen)/status/rejected");
          } else {
            router.replace("/(root_screen)/registration/step1");
          }
      }
    } else if (approvalStatus === "pending") {
      router.replace("/(root_screen)/status/pending");
    } else if (approvalStatus === "rejected") {
      router.replace("/(root_screen)/status/rejected");
    }
  }, [isLoggedIn, hasHydrated, fontsLoaded]);

  useEffect(() => {
    if (fontsLoaded && hasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, hasHydrated]);

  // 👇 Show nothing until both fonts and persistence are ready
  if (!fontsLoaded || !hasHydrated) {
    return null; // Splash screen stays visible
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={!isLoggedIn}>
              <Stack.Screen name="(auth)" />
            </Stack.Protected>

            <Stack.Protected guard={isLoggedIn}>
              <Stack.Screen name="(drawer)" />
              <Stack.Screen name="(root_screen)" />
            </Stack.Protected>

            <Stack.Screen name="(public_screens)" />
          </Stack>
          <Toast config={toastConfig} />
          <LoadingModal />
        </QueryClientProvider>
        <StatusBar backgroundColor="#0F2535" barStyle="light-content" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
