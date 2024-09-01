import { router } from "expo-router";
import React from "react";
import { View, Text } from "react-native";

import CustomButton from "@/components/CustomButton";
import GoogleInput from "@/components/GoogleInput";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";

const FindRide = () => {
  const {
    destinationAddress,
    setDestinationLocation,
    userAddress,
    setUserLocation,
  } = useLocationStore();

  return (
    <RideLayout title="Ride" snapPoint={["80%", "45%"]}>
      <View className="my-2">
        <Text className="text-lg font-JakartaSemiBold pb-3">From</Text>
        <GoogleInput
          icon={icons.target}
          initialLocation={userAddress!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="#f5f5f5"
          handlePress={(location) => setUserLocation(location)}
        />
      </View>
      <View className="my-1">
        <Text className="text-xl font-JakartaSemiBold pb-3">To</Text>
        <GoogleInput
          icon={icons.map}
          initialLocation={destinationAddress!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="#f5f5f5"
          handlePress={(location) => setDestinationLocation(location)}
        />
      </View>
      <CustomButton
        title="Find Now"
        className="mt-5"
        containerStyles=" bg-primary-500"
        textStyles="text-white"
        handlePress={() => router.push("/(root)/confirm-ride")}
      />
    </RideLayout>
  );
};

export default FindRide;
