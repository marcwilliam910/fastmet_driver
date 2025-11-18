import { STATIC_IMAGES } from "@/utils/constants";
import { Ionicons } from "@expo/vector-icons";
import polyline from "@mapbox/polyline";
import * as Location from "expo-location";
import { computeDestinationPoint, getDistance } from "geolib";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const GOOGLE_MAPS_API_KEY =
  Platform.OS === "ios"
    ? process.env.EXPO_PUBLIC_IOS_MAP_KEY
    : process.env.EXPO_PUBLIC_ANDROID_MAP_KEY;

type ManeuverInfo = {
  text: string;
  distance: string;
  maneuver: string;
};

interface Camera {
  center: { latitude: number; longitude: number };
  pitch?: number;
  heading?: number;
  altitude?: number;
  zoom?: number;
}

// Dummy pickup/drop-off points
const pickUp = { coords: { lat: 14.84593, lng: 120.81167 } }; // Bulsu Hagonoy
const dropOff = { coords: { lat: 14.82827, lng: 120.73592 } }; // Bulsu Malolos

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [driverRegion, setDriverRegion] = useState<Region | null>(null);
  const [driveMode, setDriveMode] = useState(false);
  const [routeCoords, setRouteCoords] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [instruction, setInstruction] = useState<ManeuverInfo | null>(null);
  const [lastLocation, setLastLocation] =
    useState<Location.LocationObjectCoords | null>(null);

  // Format maneuver text
  const formatInstruction = (text: string) => {
    const cleanText = text.split("Pass by")[0].trim();
    const roadMatch = cleanText.match(/on (.+?)(?:\/|$)/);
    if (roadMatch) return roadMatch[1].split("/")[0].trim();
    return cleanText.length > 40
      ? cleanText.substring(0, 40) + "..."
      : cleanText;
  };

  const renderArrow = (maneuver: string) => {
    switch (maneuver) {
      case "turn-left":
      case "turn-slight-left":
        return <Ionicons name="arrow-back" size={30} color="#000" />;
      case "turn-right":
      case "turn-slight-right":
        return <Ionicons name="arrow-forward" size={30} color="#000" />;
      case "merge":
        return <Ionicons name="arrow-down" size={30} color="#000" />;
      default:
        return <Ionicons name="arrow-up" size={30} color="#000" />;
    }
  };

  const activateDriveMode = async () => {
    setDriveMode(true);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Location permission is needed to show your position."
      );
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    animateCamera(
      loc.coords.latitude,
      loc.coords.longitude,
      loc.coords.heading ?? 0
    );
  };

  const animateCamera = (lat: number, lng: number, heading: number) => {
    const offset = computeDestinationPoint(
      { latitude: lat, longitude: lng },
      50,
      heading
    );
    const camera: Partial<Camera> = {
      center: { latitude: offset.latitude, longitude: offset.longitude },
      pitch: 60,
      heading,
      zoom: 17,
    };
    mapRef.current?.animateCamera(camera, { duration: 1000 });
  };

  // INITIAL + LIVE DRIVER LOCATION
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location permission is required.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setDriverRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      fetchRouteSteps(
        loc.coords.latitude,
        loc.coords.longitude,
        pickUp.coords.lat,
        pickUp.coords.lng
      );

      if (driveMode) return; // live updates only if driveMode

      const MIN_DISTANCE = 5; // meters
      const MIN_HEADING_CHANGE = 10; // degrees

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 5000,
          distanceInterval: 5, // still report all small movements
        },
        (loc) => {
          const { latitude, longitude, heading } = loc.coords;

          if (lastLocation) {
            const dist = getDistance(
              { latitude, longitude },
              {
                latitude: lastLocation.latitude,
                longitude: lastLocation.longitude,
              }
            );

            const headingDiff = Math.abs(
              (heading ?? 0) - (lastLocation.heading ?? 0)
            );

            if (dist < MIN_DISTANCE && headingDiff < MIN_HEADING_CHANGE) {
              return; // Ignore tiny movements
            }
          }

          setLastLocation(loc.coords);
          animateCamera(latitude, longitude, heading ?? 0);
        }
      );

      return () => subscription.remove();
    })();
  }, [driveMode, lastLocation]);

  /** FETCH TURN-BY-TURN INSTRUCTIONS */
  async function fetchRouteSteps(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number
  ) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destLat},${destLng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const json = await res.json();
      if (!json.routes?.length) return;

      const points = polyline.decode(json.routes[0].overview_polyline.points);
      setRouteCoords(
        points.map(([lat, lng]) => ({ latitude: lat, longitude: lng }))
      );

      const steps = json.routes[0].legs[0]?.steps ?? [];
      if (!steps.length) return;

      const next = steps[0];
      setInstruction({
        text: next.html_instructions.replace(/<[^>]+>/g, ""),
        distance: next.distance.text,
        maneuver: next.maneuver ?? "straight",
      });
    } catch (err) {
      console.log("Directions error:", err);
    }
  }

  return (
    <View className="flex-1">
      {driverRegion && (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          initialRegion={driverRegion}
          showsUserLocation
          followsUserLocation
        >
          <Marker
            coordinate={{
              latitude: pickUp.coords.lat,
              longitude: pickUp.coords.lng,
            }}
            title="Pick Up"
            image={STATIC_IMAGES.pickup}
          />
          <Marker
            coordinate={{
              latitude: dropOff.coords.lat,
              longitude: dropOff.coords.lng,
            }}
            title="Drop Off"
            image={STATIC_IMAGES.dropoff}
          />

          <Marker
            coordinate={{
              latitude: driverRegion.latitude,
              longitude: driverRegion.longitude,
            }}
            title="You"
          />

          <Polyline
            coordinates={routeCoords}
            strokeWidth={5}
            strokeColor="#007AFF"
          />

          <MapViewDirections
            origin={{
              latitude: pickUp.coords.lat,
              longitude: pickUp.coords.lng,
            }}
            destination={{
              latitude: dropOff.coords.lat,
              longitude: dropOff.coords.lng,
            }}
            apikey={GOOGLE_MAPS_API_KEY ?? ""}
            strokeWidth={3}
            strokeColor="#999"
          />
        </MapView>
      )}

      {/* Top instruction card */}
      {instruction && (
        <View className="absolute top-10 left-0 right-0 items-center px-4">
          <View className="w-full max-w-md bg-[#1F2A38] rounded-3xl border border-gray-600/30 overflow-hidden">
            <View className="flex-row items-center px-5 py-4 gap-4">
              {/* Arrow icon container */}
              <View className="bg-[#FFB347] rounded-full p-3 shadow-md">
                <View className="w-8 h-8 items-center justify-center">
                  {renderArrow(instruction.maneuver)}
                </View>
              </View>

              {/* Text and distance */}
              <View className="flex-1 gap-2">
                <Text
                  className="font-extrabold text-xl text-white"
                  numberOfLines={1}
                >
                  {formatInstruction(instruction.text)}
                </Text>

                <Text className="text-sm text-gray-200">
                  {maneuverTextMap[instruction.maneuver] || "Continue"}
                </Text>

                <View className="flex-row items-center gap-2">
                  <View className="bg-[#FFB347]/25 rounded-lg px-3 py-1.5 border border-[#FFB347]/40">
                    <Text className="text-sm font-semibold text-[#FFB347]">
                      {instruction.distance}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Drive mode button */}
      <Pressable
        onPress={activateDriveMode}
        className="absolute top-20 right-10 bg-white p-3 rounded-xl shadow"
      >
        <Ionicons name="car" size={22} color="black" />
      </Pressable>
    </View>
  );
}

const maneuverTextMap: Record<string, string> = {
  "turn-left": "Turn left",
  "turn-right": "Turn right",
  merge: "Merge",
  "roundabout-left": "Take the roundabout left",
  "roundabout-right": "Take the roundabout right",
  straight: "Go straight",
  "ramp-left": "Take the left ramp",
  "ramp-right": "Take the right ramp",
  "fork-left": "Keep left",
  "fork-right": "Keep right",
  "uturn-left": "Make a U-turn left",
  "uturn-right": "Make a U-turn right",
};
