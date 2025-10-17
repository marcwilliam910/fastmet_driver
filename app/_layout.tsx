import {
  Montserrat_400Regular,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import {SplashScreen, Stack} from "expo-router";
import {useEffect} from "react";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {SafeAreaProvider} from "react-native-safe-area-context";

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
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Protected guard={!isLoggedIn}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>

          <Stack.Protected guard={isLoggedIn}>
            <Stack.Screen name="(drawer)" />
          </Stack.Protected>

          <Stack.Screen name="(root_screen)" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
