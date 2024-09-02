import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Image, Alert } from "react-native";
import ReactNativeModal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import OAuth from "@/components/Oauth";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [verification, setVerification] = useState({
    code: "",
    status: "",
    error: "",
  });
  const [isSuccessModal, setSucessModal] = useState(false);
  const { isLoaded, signUp, setActive } = useSignUp();
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({
        ...verification,
        status: "pending",
      });
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        // saving in postgress database
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            clerkId: completeSignUp.createdUserId,
          }),
        });

        setVerification({
          ...verification,
          status: "success",
        });
      } else {
        setVerification({
          ...verification,
          status: "failed",
          error: "Verification failed",
        });
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        status: "failed",
        error: err.errors[0].longMessage,
      });
    }
  };

  useEffect(() => {
    if (isSuccessModal) {
      const timeout = setTimeout(() => {
        setSucessModal(false);
        router.push("/(root)/(tabs)/home");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isSuccessModal]);
  return (
    <SafeAreaView className="flex-1 h-full bg-white">
      <View className="relative w-full h-[250px] ">
        <Image
          source={images.signUpCar as any}
          alt="signup"
          className="w-full h-full z-0"
        />
        <Text className="text-[#333333] font-JakartaBold text-3xl absolute bottom-3 left-3">
          Create Your Account
        </Text>
      </View>
      <View className="p-5">
        <CustomInput
          title="Name"
          value={formData.name}
          handlechange={(value) =>
            setFormData({
              ...formData,
              name: value,
            })
          }
          placeholder="Enter your name"
          iconName={icons.person}
          otherstyles="mt-4"
        />
        <CustomInput
          title="Email"
          value={formData.email}
          handlechange={(value) =>
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
          handlechange={(value) =>
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
          title="Sign Up"
          textStyles="text-white font-JakartaBold"
          containerStyles="w-full mt-6 bg-primary-500"
          handlePress={onSignUpPress}
        />
        {/* OAuth */}
        <OAuth />

        <Text
          className="text-lg text-center mt-6
       text-general-200 flex flex-row "
        >
          <Text>Already have an account? </Text>
          <Link
            href="/(auth)/sign-in"
            className=" text-primary-500 hover:underline  cursor-pointer"
          >
            Login
          </Link>
        </Text>
        <ReactNativeModal
          isVisible={verification.status === "pending"}
          onModalHide={() => {
            if (verification.status === "success") setSucessModal(true);
          }}
        >
          <View
            className="py-9
           px-6 min-h-[300px] bg-white rounded-2xl"
          >
            <Text className="text-xl font-JakartaBold text-black">
              Verification Code
            </Text>
            <Text
              className="text-base mt-2 text-gray-400
             font-Jakarta"
            >
              An otp code have been sent to {formData.email}
            </Text>
            <CustomInput
              title="Code"
              value={verification.code}
              handlechange={(value) =>
                setVerification({
                  ...verification,
                  code: value,
                })
              }
              placeholder="12345"
              keyboardType="numeric"
              iconName={icons.lock}
              otherstyles="mt-4"
              textstyle=" font-JakartaSemiBold"
            />
            {verification.status === "failed" && (
              <Text
                className="text-sm mt-2 text-red-500 font-Jakarta
              "
              >
                {verification.error}
              </Text>
            )}

            <CustomButton
              title="Verify Email"
              textStyles="text-white font-JakartaBold"
              containerStyles="w-full mt-6 bg-success-500"
              handlePress={onPressVerify}
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={isSuccessModal}>
          <View
            className="flex flex-col items-center justify-center
           p-6 min-h-[300px] bg-white rounded-2xl"
          >
            <Image
              source={images.check as any}
              alt="checkmark"
              className="w-[110px] h-[110px]"
            />
            <Text className="text-xl mt-4 font-JakartaBold text-black">
              Verified!
            </Text>
            <Text
              className="text-base mt-3 text-gray-400
             font-Jakarta text-center"
            >
              You have successfully verified your account.
            </Text>
            {/* <CustomButton
              title="Browse Home"
              textStyles="text-white font-JakartaBold"
              containerStyles="w-full mt-6 bg-primary-500"
              // handlePress={() => router.replace("/(root)/(tabs)/home")}
            /> */}
          </View>
        </ReactNativeModal>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
