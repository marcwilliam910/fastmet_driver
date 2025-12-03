export default {
  expo: {
    name: "FastMet Driver App",
    slug: "fastmet_driver",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/fastmet/icon.png",
    scheme: "fastmetdriver",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      bundleIdentifier: "com.guildsman.fastmetdriver",
      supportsTablet: true,
      // config: {
      //   googleMapsApiKey: process.env.EXPO_PUBLIC_IOS_MAP_KEY,
      // },
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "We need your location to show navigation.",
        // ADD THESE:
        NSLocationAlwaysUsageDescription:
          "We need your location in the background to track your delivery route.",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "We need your location to show navigation and track deliveries.",
        NSPhotoLibraryUsageDescription:
          "We need access to your photos to upload pictures.",
        NSCameraUsageDescription:
          "We need camera access to take photos for deliveries.",
        // For background location (since you use expo-task-manager):
        UIBackgroundModes: ["location"],
      },
    },
    android: {
      package: "com.guildsman.fastmetdriver",
      // config: {
      //   googleMaps: {
      //     apiKey: process.env.EXPO_PUBLIC_ANDROID_MAP_KEY,
      //   },
      // },
      adaptiveIcon: {
        foregroundImage: "./assets/fastmet/icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"],
    },
    web: {
      output: "static",
      favicon: "./assets/fastmet/icon.png",
      bundler: "metro",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
          },
        },
      ],
      [
        "@rnmapbox/maps",
        {
          RNMapboxMapsImpl: "mapbox",
        },
      ],
      "expo-web-browser",
      "expo-secure-store",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      eas: {
        projectId: "3090586e-850e-4f59-9d05-0d3e3dffa7a9",
      },
      apiUrl:
        process.env.NODE_ENV === "production"
          ? process.env.EXPO_PUBLIC_API_URL_PROD
          : process.env.EXPO_PUBLIC_API_URL_DEV,
    },
  },
};
