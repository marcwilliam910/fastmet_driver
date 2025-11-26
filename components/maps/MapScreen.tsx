import { useAppStore } from "@/store/useAppStore";
import {
  MANEUVER_MAP,
  MAPBOX_PUBLIC_KEY,
  STATIC_IMAGES,
} from "@/utils/constants";
import { formatDistance, formatInstruction, formatTime } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import MapboxGL, { UserTrackingMode } from "@rnmapbox/maps";
// import { Image } from "expo-image";
import { Image } from "expo-image";
import * as Location from "expo-location";
import { computeDestinationPoint } from "geolib";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

MapboxGL.setAccessToken(MAPBOX_PUBLIC_KEY);

type ManeuverInfo = {
  text: string;
  distance: string;
  distanceMeters: number;
  maneuver: string;
};

export default function MapboxDriverMap() {
  const mapRef = useRef<MapboxGL.MapView>(null);
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(
    null
  );
  const [driverLocation, setDriverLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [isDriving, setIsDriving] = useState(false);
  const [routeCoords, setRouteCoords] = useState<number[][]>([]);
  const [instruction, setInstruction] = useState<ManeuverInfo | null>(null);
  const [totalDistance, setTotalDistance] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);
  const [allSteps, setAllSteps] = useState<any[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const activeBooking = useAppStore((s) => s.activeBooking);

  const pickUp = activeBooking?.pickUp || { coords: { lat: 0, lng: 0 } };
  const dropOff = activeBooking?.dropOff || { coords: { lat: 0, lng: 0 } };

  const insets = useSafeAreaInsets();

  const renderArrow = (maneuver: string) => {
    const iconProps = { size: 32, color: "#FB923C" }; // Orange color

    switch (maneuver) {
      case "turn-left":
      case "turn-slight-left":
        return <Ionicons name="arrow-back" {...iconProps} />;
      case "turn-sharp-left":
        return <Ionicons name="return-up-back" {...iconProps} />;
      case "turn-right":
      case "turn-slight-right":
        return <Ionicons name="arrow-forward" {...iconProps} />;
      case "turn-sharp-right":
        return <Ionicons name="return-up-forward" {...iconProps} />;
      case "merge":
        return <Ionicons name="git-merge" {...iconProps} />;
      case "roundabout-left":
      case "roundabout-right":
        return <Ionicons name="radio-button-on" {...iconProps} />;
      case "arrive":
        return <Ionicons name="location" {...iconProps} />;
      case "depart":
        return <Ionicons name="play-circle" {...iconProps} />;
      default:
        return <Ionicons name="arrow-up" {...iconProps} />;
    }
  };

  const activateDriveMode = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Location permission is needed for navigation."
      );
      return;
    }

    setIsLoading(true);
    setIsDriving(true);

    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setDriverLocation(loc.coords);

      await fetchRouteSteps(
        loc.coords.latitude,
        loc.coords.longitude,
        pickUp.coords.lat,
        pickUp.coords.lng
      );

      animateCamera(
        loc.coords.latitude,
        loc.coords.longitude,
        loc.coords.heading ?? 0
      );
    } catch (error) {
      console.error("Error activating drive mode:", error);
      Alert.alert("Error", "Failed to get your location");
      setIsDriving(false);
    } finally {
      setIsLoading(false);
    }
  };

  const animateCamera = (lat: number, lng: number, heading: number) => {
    const cameraCenterOffset = computeDestinationPoint(
      { latitude: lat, longitude: lng },
      150,
      heading
    );

    cameraRef.current?.setCamera({
      centerCoordinate: [
        cameraCenterOffset.longitude,
        cameraCenterOffset.latitude,
      ],
      pitch: 65,
      heading: heading,
      zoomLevel: 17.5,
      animationDuration: 600,
    });
  };

  // Update current instruction based on driver's position
  const updateCurrentInstruction = (coords: Location.LocationObjectCoords) => {
    if (!allSteps.length || !isDriving) return;

    // Simple distance-based step progression
    const currentStep = allSteps[currentStepIndex];
    if (!currentStep) return;

    const stepCoords = currentStep.maneuver.location;
    const distance = getDistance(
      coords.latitude,
      coords.longitude,
      stepCoords[1],
      stepCoords[0]
    );

    // If within 20 meters of next step, advance
    if (distance < 20 && currentStepIndex < allSteps.length - 1) {
      const nextStepIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextStepIndex);
      const nextStep = allSteps[nextStepIndex];

      setInstruction({
        text: nextStep.maneuver.instruction,
        distance: formatDistance(nextStep.distance),
        distanceMeters: nextStep.distance,
        maneuver: nextStep.maneuver.type ?? "straight",
      });
    } else {
      // Update distance to current step
      setInstruction((prev) =>
        prev
          ? {
              ...prev,
              distance: formatDistance(distance),
              distanceMeters: distance,
            }
          : null
      );
    }
  };

  // Simple distance calculation
  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setDriverLocation(loc.coords);

      await fetchRouteSteps(
        loc.coords.latitude,
        loc.coords.longitude,
        pickUp.coords.lat,
        pickUp.coords.lng
      );

      // Clean up previous subscription
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 20,
        },
        (loc) => {
          setDriverLocation(loc.coords);

          if (isDriving) {
            animateCamera(
              loc.coords.latitude,
              loc.coords.longitude,
              loc.coords.heading ?? 0
            );
            updateCurrentInstruction(loc.coords);
          }
        }
      );

      locationSubscription.current = subscription;

      return () => {
        subscription.remove();
      };
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDriving]);

  async function fetchRouteSteps(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number
  ) {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${originLng},${originLat};${destLng},${destLat}?geometries=geojson&steps=true&overview=full&banner_instructions=true&voice_instructions=true&access_token=${MAPBOX_PUBLIC_KEY}`;
      const res = await fetch(url);
      const json = await res.json();

      const route = json.routes[0];
      if (!route) return;

      const coords = route.geometry?.coordinates ?? [];
      setRouteCoords(coords);

      setTotalDistance(formatDistance(route.distance));
      setEstimatedTime(formatTime(route.duration));

      const steps = route.legs[0]?.steps ?? [];
      setAllSteps(steps);
      setCurrentStepIndex(0);

      const firstStep = steps[0];
      if (firstStep) {
        setInstruction({
          text: firstStep.maneuver.instruction,
          distance: formatDistance(firstStep.distance),
          distanceMeters: firstStep.distance,
          maneuver: firstStep.maneuver.type ?? "straight",
        });
      }
    } catch (err) {
      console.error("Mapbox Directions error:", err);
      Alert.alert("Error", "Failed to fetch route");
    }
  }

  const MarkerImage = ({ source }: { source: any }) => (
    <View style={{ width: 40, height: 40 }}>
      <Image
        source={source}
        style={{ width: "100%", height: "100%" }}
        contentFit="contain"
        contentPosition="center"
      />
    </View>
  );

  return (
    <View className="flex-1">
      <StatusBar hidden />
      <MapboxGL.MapView
        ref={mapRef}
        style={{ flex: 1 }}
        styleURL={MapboxGL.StyleURL.Street}
        compassEnabled={false}
        rotateEnabled={!isDriving}
        pitchEnabled={!isDriving}
        logoEnabled={false}
        attributionEnabled={false}
        scaleBarEnabled={false}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          followUserLocation={isDriving}
          followUserMode={UserTrackingMode.FollowWithCourse}
          centerCoordinate={[pickUp.coords.lng, pickUp.coords.lat]}
          zoomLevel={isDriving ? 17.5 : 16.5}
          pitch={isDriving ? 65 : 0}
        />

        {/* Hide default user location */}
        <MapboxGL.UserLocation visible={false} />

        {/* Custom driver location arrow */}
        <MapboxGL.Images
          images={{ navigationArrow: STATIC_IMAGES.currentLoc }}
        />

        {/* Pick up marker */}
        <MapboxGL.PointAnnotation
          id="pickup"
          coordinate={[pickUp.coords.lng, pickUp.coords.lat]}
        >
          <MarkerImage source={STATIC_IMAGES.pickup} />
        </MapboxGL.PointAnnotation>

        {/* Drop off marker */}
        <MapboxGL.PointAnnotation
          id="dropoff"
          coordinate={[dropOff.coords.lng, dropOff.coords.lat]}
        >
          <MarkerImage source={STATIC_IMAGES.dropoff} />
        </MapboxGL.PointAnnotation>

        {/* ROUTE - Render FIRST (base layer) */}
        {routeCoords.length > 0 && (
          <MapboxGL.ShapeSource
            id="routeSource"
            shape={{
              type: "Feature",
              geometry: { type: "LineString", coordinates: routeCoords },
              properties: {},
            }}
          >
            <MapboxGL.LineLayer
              id="routeOutline"
              style={{
                lineWidth: 8,
                lineColor: "#FFFFFF",
                lineJoin: "round",
                lineCap: "round",
                lineOpacity: 0.5,
              }}
            />
            <MapboxGL.LineLayer
              id="routeLine"
              style={{
                lineWidth: 6,
                lineColor: "#034efc",
                lineJoin: "round",
                lineCap: "round",
                lineOpacity: 0.9,
              }}
            />
          </MapboxGL.ShapeSource>
        )}

        {/* DRIVER ARROW - Render SECOND (dependent layer) */}
        {/* Only show if route exists AND driver location exists */}
        {routeCoords.length > 0 && driverLocation && (
          <MapboxGL.ShapeSource
            id="driverLocationSource"
            shape={{
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [
                  driverLocation.longitude,
                  driverLocation.latitude,
                ],
              },
              properties: {},
            }}
          >
            <MapboxGL.SymbolLayer
              id="driverArrow"
              aboveLayerID="routeLine"
              style={{
                iconImage: "navigationArrow",
                iconSize: 0.4,
                iconRotate: driverLocation.heading ?? 0,
                iconRotationAlignment: "map",
                iconAllowOverlap: true,
                iconIgnorePlacement: true,
                iconPitchAlignment: "map",
              }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>

      {/* Enhanced instruction card */}
      {instruction && (
        <View
          className="absolute left-4 right-4 z-10"
          style={{ top: insets.top }}
        >
          <View className="bg-white rounded-3xl overflow-hidden">
            {/* Top info bar */}
            <View className="bg-lightPrimary px-5 py-3 flex-row justify-between items-center">
              <View className="flex-row items-center gap-2">
                <Ionicons name="time-outline" size={18} color="white" />
                <Text className="text-white font-semibold text-sm">
                  {estimatedTime || "Calculating..."}
                </Text>
              </View>

              {isDriving ? (
                <View className="bg-green-600 rounded-full px-4 py-1.5 flex-row items-center gap-2 ">
                  <View className="w-2 h-2 bg-white rounded-full" />
                  <Text className="text-white font-bold text-xs tracking-wide">
                    NAVIGATING
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center gap-2">
                  <Ionicons name="navigate-outline" size={18} color="white" />
                  <Text className="text-white font-semibold text-sm">
                    {totalDistance || "..."}
                  </Text>
                </View>
              )}
            </View>

            {/* Main instruction */}
            <View className="flex-row items-center px-5 py-6 gap-4">
              {/* Arrow icon box */}
              <View className="bg-orange-200/70 rounded-2xl p-4 ">
                <View className="size-8 items-center justify-center">
                  {renderArrow(instruction.maneuver)}
                </View>
              </View>

              {/* Texts */}
              <View className="flex-1 gap-1">
                <Text
                  className="font-bold text-xl text-gray-900 leading-tight"
                  numberOfLines={2}
                >
                  {formatInstruction(instruction.text)}
                </Text>

                <Text className="text-sm text-gray-500 tracking-wide">
                  {MANEUVER_MAP[instruction.maneuver] || "Continue"}
                </Text>
              </View>

              {/* Distance block */}
              <View className="items-end justify-center min-w-[60px]">
                <Text className="text-3xl font-extrabold text-orange-600">
                  {instruction.distance}
                </Text>

                {instruction.distanceMeters < 100 && (
                  <View className="bg-red-600 rounded-full px-3 py-1 mt-1">
                    <Text className="text-white text-xs font-bold">SOON</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Drive Now Button */}
            {!isDriving && driverLocation && routeCoords.length > 0 && (
              <View className="px-5 pb-5">
                <Pressable
                  onPress={activateDriveMode}
                  disabled={isLoading}
                  className="bg-lightPrimary rounded-2xl px-6 py-4 flex-row items-center justify-center gap-3 active:bg-darkPrimary"
                >
                  {isLoading ? (
                    <>
                      <Ionicons name="hourglass" size={22} color="white" />
                      <Text className="text-white font-bold text-lg">
                        Loading...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="car-sport" size={24} color="white" />
                      <Text className="text-white font-bold text-lg">
                        Drive Now
                      </Text>
                      <Ionicons name="arrow-forward" size={22} color="white" />
                    </>
                  )}
                </Pressable>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Control buttons */}
      {isDriving && (
        <View
          className="absolute right-2 flex-row z-20"
          style={{
            bottom: insets.bottom + 85,
          }}
        >
          <Pressable
            onPress={() => setIsDriving(false)}
            disabled={isLoading}
            className={`p-4 rounded-2xl bg-red-500 `}
          >
            <Ionicons
              name="stop"
              size={24}
              color="white"
              className="animate-pulse"
            />
          </Pressable>
        </View>
      )}
    </View>
  );
}
