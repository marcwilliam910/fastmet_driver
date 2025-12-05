import { apiUrl } from "@/lib/axios";
import { useAppStore } from "@/store/useAppStore";

import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export const openGallery = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    Alert.alert("Sorry, we need camera roll permissions!");
    return null;
  }

  return ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    quality: 1,
  });
};

export const takePhoto = async (): Promise<string | null> => {
  // 1. Request camera permissions
  const { status: cameraStatus } =
    await ImagePicker.requestCameraPermissionsAsync();
  if (cameraStatus !== "granted") {
    alert("Sorry, we need camera permissions!");
    return null;
  }

  // 2. Take the photo
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: false,
    quality: 1,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    return null; // Return null if the user canceled the action
  }

  return result.assets[0].uri;
};

// export const addTimeAndLocationToImage = async (
//   imageUri: string
// ): Promise<string | null> => {
//   // 1. Request location permissions
//   const { status: locationStatus } =
//     await Location.requestForegroundPermissionsAsync();
//   if (locationStatus !== "granted") {
//     alert("Sorry, we need location permissions!");
//     return null;
//   }

//   try {
//     // 2. Get current location and format text
//     const currentLocation = await Location.getCurrentPositionAsync({});
//     const now = new Date();
//     const timeAndLocationText = `${now.toLocaleString()} | Lat: ${currentLocation.coords.latitude.toFixed(4)}, Lon: ${currentLocation.coords.longitude.toFixed(4)}`;

//     // 3. Get the original image's dimensions to properly position the text
//     const imageSize = await new Promise<{ width: number; height: number }>(
//       (resolve, reject) => {
//         Image.getSize(
//           imageUri,
//           (width, height) => resolve({ width, height }),
//           reject
//         );
//       }
//     );

//     // 4. Configure the text options for the bottom right corner
//     const fontSize = imageSize.width / 25;
//     const padding = 20;
//     const textOptions: TextOptions[] = [
//       {
//         text: timeAndLocationText,
//         color: "#ffffff", // White text
//         textSize: fontSize,
//         position: {
//           x:
//             imageSize.width -
//             timeAndLocationText.length * (fontSize * 0.5) -
//             padding,
//           y: imageSize.height - fontSize - padding,
//         },
//       },
//     ];

//     // 5. Use RNPhotoManipulator to add the text
//     const manipulatedImageUri = await RNPhotoManipulator.printText(
//       imageUri,
//       textOptions
//     );

//     return manipulatedImageUri;
//   } catch (error) {
//     console.error("Error adding text to image:", error);
//     return null;
//   }
// };

// export const takePhotoAndAddText = async (): Promise<string | null> => {
//   // 1. Take the photo
//   const photoUri = await takePhoto();
//   if (!photoUri) {
//     return null;
//   }

//   // 2. Add text overlay
//   const editedPhotoUri = await addTimeAndLocationToImage(photoUri);
//   return editedPhotoUri;
// };

// upload to cloudinary
export const uploadAllImages = async (
  step: number,
  images: { [key: string]: string }
): Promise<{ success: boolean }> => {
  const form = new FormData();

  form.append("step", step.toString());

  Object.entries(images).forEach(([key, uri]) => {
    if (!uri) return;
    form.append("images", {
      uri,
      type: "image/jpeg",
      name: `${key}.jpg`,
    } as any);
    form.append("types", key); // maps to same index
  });

  const res = await axios.post(
    `${apiUrl}/profile/documents-upload`,
    form, // IMPORTANT: this must be the body
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${useAppStore.getState().token}`,
      },
    }
  );

  return res.data;
};

export const pickImage = async (
  setImageUri: React.Dispatch<React.SetStateAction<string | null>>
) => {
  Alert.alert(
    "Upload Photo",
    "Choose an option",
    [
      { text: "Cancel", style: "cancel" },

      {
        text: "Camera",
        onPress: async () => {
          const uri = await takePhoto();
          if (uri) setImageUri(uri);
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const result = await openGallery();
          if (result?.canceled === false && result.assets?.length > 0) {
            setImageUri(result.assets[0].uri);
          }
        },
      },
    ],
    { cancelable: true }
  );
};
