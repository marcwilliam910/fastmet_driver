import { Pressable, Text, View } from "react-native";

const ExitMapModal = ({
  visible,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 bg-black/40 items-center justify-center px-8 z-50">
      <View className="bg-white w-full max-w-sm rounded-2xl p-6">
        <Text className="text-xl font-bold text-gray-900 mb-2">
          Leave Navigation?
        </Text>

        <Text className="text-gray-600 text-base mb-6">
          You are currently using the navigation screen. Exiting now will stop
          map guidance.
        </Text>

        <View className="flex-row justify-end gap-6 mt-2">
          <Pressable onPress={onCancel}>
            <Text className="text-gray-600 text-lg font-semibold">Stay</Text>
          </Pressable>

          <Pressable onPress={onConfirm}>
            <Text className="text-red-600 text-lg font-bold">Exit</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ExitMapModal;
