import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

import CustomButton from "@/components/CustomButton";
import { data } from "@/constants";

const Welcome = () => {
  const swiperRef = useRef<Swiper>(null);
  const [active, setActive] = useState(0);
  const lastSlide = active === data.onboarding.length - 1;
  return (
    <SafeAreaView className="h-full flex-1 bg-white justify-center py-4 items-center">
      <TouchableOpacity
        onPress={() => router.replace("/(auth)/sign-up")}
        className="flex justify-end w-full items-end p-5"
      >
        <Text className="text-base text-black font-JakartaBold">Skip</Text>
      </TouchableOpacity>
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={
          <View className="h-[4px] w-[32px] bg-[#E2E8F0] mx-1 rounded-full" />
        }
        activeDot={
          <View className="h-[4px] w-[32px] bg-[#0286FF] mx-1 rounded-full" />
        }
        onIndexChanged={(index) => setActive(index)}
      >
        {data.onboarding.map((data, index) => (
          <View key={index} className="p-5 justify-center flex  items-center">
            <Image
              source={data.image}
              alt={data.title}
              className="w-full h-[350px]"
              resizeMode="contain"
            />
            <View className="flex items-center justify-center text-center w-full mt-10">
              <Text className="text-3xl  font-bold text-center mx-10">
                {data.title}
              </Text>
            </View>
            <Text className=" font-JakartaSemiBold text-lg mx-6 mt-4 text-[#858585] text-center">
              {data.description}
            </Text>
          </View>
        ))}
      </Swiper>
      <CustomButton
        handlePress={() =>
          lastSlide
            ? router.replace("/(auth)/sign-up")
            : swiperRef.current?.scrollBy(1)
        }
        title={lastSlide ? "Get Started" : "Next"}
        textStyles="text-white font-JakartaBold"
        containerStyles="w-11/12 mt-10 bg-primary-500"
      />
    </SafeAreaView>
  );
};

export default Welcome;
