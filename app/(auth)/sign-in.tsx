import { useSignIn } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, SafeAreaView, Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import OAuth from "@/components/Oauth";
import { icons, images } from "@/constants";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { signIn, setActive, isLoaded } = useSignIn();
  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }
    try {
      const signInAttempt = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push("/(root)/(tabs)/home");
      } else {
        Alert.alert("error", "Error Signing in");
      }
    } catch (err: any) {
      Alert.alert("Error", err.errors.longMessage);
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <SafeAreaView className="flex-1 h-full bg-white">
      <View className="relative w-full h-[250px] ">
        <Image
          source={images.signUpCar as any}
          alt="signup"
          className="w-full h-full z-0"
        />
        <Text className="text-[#333333] font-JakartaBold text-3xl absolute bottom-3 left-3">
          Welcome 👋
        </Text>
      </View>
      <View className="p-5">
        <CustomInput
          title="Email"
          value={formData.email}
          handlechange={(value: any) =>
            setFormData({
              ...formData,
              email: value,
            })
          }
          placeholder="Enter your email"
          keyboardType="email-address"
          iconName={icons.email}
          otherstyles="mt-4"
        />
        <CustomInput
          title="Password"
          value={formData.password}
          handlechange={(value: any) =>
            setFormData({
              ...formData,
              password: value,
            })
          }
          placeholder="Enter your password"
          iconName={icons.lock}
          otherstyles="mt-4"
        />
        <CustomButton
          title="Sign In"
          textStyles="text-white font-JakartaBold"
          containerStyles="w-full mt-6 bg-primary-500"
          handlePress={onSignInPress}
        />
        {/* OAuth */}
        <OAuth />

        <Text
          className="text-lg text-center mt-6
       text-general-200 flex flex-row"
        >
          <Text>Don't have an account? </Text>
          <Link
            href="/sign-in"
            className=" text-primary-500 hover:underline cursor-pointer"
          >
            Sign Up
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
