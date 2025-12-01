import { Platform } from "react-native";

export const GOOGLE_MAPS_API_KEY =
  Platform.OS === "ios"
    ? process.env.EXPO_PUBLIC_IOS_MAP_KEY
    : process.env.EXPO_PUBLIC_ANDROID_MAP_KEY;

export const STATIC_IMAGES = {
  pickup: require("@/assets/images/pickup.png"),
  dropoff: require("@/assets/images/dropoff.png"),
  currentLoc: require("@/assets/images/gps.png"),
};

export const MAPBOX_PUBLIC_KEY =
  "pk.eyJ1IjoiMnRobGVzcyIsImEiOiJjbWkzeG42MmgyNWhwMmtvc2NqeXI2eWFuIn0.zoAoT_HHzMZ4MkX77gwndA";

export const MANEUVER_MAP: Record<string, string> = {
  "turn-left": "Turn left",
  "turn-right": "Turn right",
  "turn-sharp-left": "Sharp left",
  "turn-sharp-right": "Sharp right",
  "turn-slight-left": "Slight left",
  "turn-slight-right": "Slight right",
  merge: "Merge",
  "roundabout-left": "Roundabout left",
  "roundabout-right": "Roundabout right",
  straight: "Continue straight",
  "ramp-left": "Left ramp",
  "ramp-right": "Right ramp",
  arrive: "Arrive",
  depart: "Start",
};

export const MAX_LOCATION_RADIUS_KM = 1; //1KM
