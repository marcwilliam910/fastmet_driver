import {Ionicons} from "@expo/vector-icons";
import {Image, ImageBackground} from "expo-image";
import {Pressable, Text, View} from "react-native";

const Earnings = () => {
  return (
    <View className="flex-1 p-3 bg-white">
      <View className="gap-2">
        {/* Balance Card */}
        <ImageBackground
          source={require("@/assets/images/credit_card.png")}
          style={{width: "100%", height: 180}}
          contentFit="fill"
        >
          <View className="justify-between flex-1 p-5">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-white">
                Total Fund
              </Text>
              <View className="p-2 bg-white rounded-lg">
                <Image
                  source={require("@/assets/fastmet/logo.png")}
                  style={{width: 40, height: 25}}
                  contentFit="contain"
                />
              </View>
            </View>

            <Text className="text-4xl font-bold text-white">Php 10,000</Text>

            <View className="pt-2 border-t border-yellow-400 ">
              <Text className="text-lg font-light tracking-wide text-white">
                FastMet
              </Text>
            </View>
          </View>
        </ImageBackground>

        {/* Action Buttons */}
        <View className="flex-row gap-3 px-2">
          <Pressable className="relative justify-center flex-1 gap-2 p-3 bg-lightPrimary rounded-2xl active:bg-darkPrimary">
            <View className="items-center justify-center bg-white rounded-full size-14">
              <Image
                source={require("@/assets/images/bond.png")}
                style={{width: 30, height: 30}}
                contentFit="contain"
              />
            </View>
            <Text className="font-semibold text-white">Security Bond</Text>
            <Text className="text-lg font-bold text-white">Php 5,000</Text>

            <Pressable className="absolute top-2 right-2">
              <Ionicons
                name="information-circle"
                size={24}
                color="rgb(255 255 255 / 0.8)"
              />
            </Pressable>
          </Pressable>
          <Pressable className="relative justify-center flex-1 gap-2 p-3 bg-lightPrimary rounded-2xl active:bg-darkPrimary">
            <View className="items-center justify-center bg-white rounded-full size-14">
              <Image
                source={require("@/assets/images/withdraw.png")}
                style={{width: 30, height: 30}}
                contentFit="contain"
              />
            </View>
            <Text className="font-semibold text-white ">Withdrawable</Text>
            <Text className="text-lg font-bold text-white">Php 2,452</Text>

            <Pressable className="absolute top-2 right-2">
              <Ionicons
                name="information-circle"
                size={24}
                color="rgb(255 255 255 / 0.8)"
              />
            </Pressable>
          </Pressable>
        </View>
      </View>

      <Pressable className="items-center py-4 mt-auto rounded-lg bg-lightPrimary active:bg-darkPrimary">
        <Text className="text-base font-bold text-white">
          Transaction History
        </Text>
      </Pressable>
    </View>
  );
};

export default Earnings;
