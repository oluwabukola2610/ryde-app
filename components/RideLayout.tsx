import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { icons } from "@/constants";

import Map from "./Map";

const RideLayout = ({
  title,
  children,
  snapPoint,
}: {
  title: string;
  children: React.ReactNode;
  snapPoint: string[];
}) => {
  const bottomSheet = useRef<BottomSheet>(null);
  return (
    <GestureHandlerRootView>
      <View className="h-screen bg-blue-500 flex-1 ">
        <View className="flex flex-row  absolute z-10 top-16 items-center justify-start px-4 ">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white rounded-full p-2"
          >
            <Image
              source={icons.backArrow as any}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text className="text-black  font-JakartaSemiBold text-xl ml-5">
            {title || "Go Back"}
          </Text>
        </View>
        <Map />
      </View>
      <BottomSheet
        ref={bottomSheet}
        snapPoints={snapPoint || ["40%", "85%"]}
        index={0}
      >
        <BottomSheetView
          style={{
            flex: 1,
            padding: 20,
          }}
        >
          {children}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default RideLayout;
