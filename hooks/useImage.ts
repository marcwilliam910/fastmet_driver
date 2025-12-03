import { openGallery, takePhoto } from "@/utils/imagePicker";
import { Alert } from "react-native";

export default function useImage() {
  const pickImage = async (
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

  return { pickImage };
}
