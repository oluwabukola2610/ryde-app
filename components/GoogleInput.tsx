import React from "react";
import { View, Image } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { GoogleInputProps } from "@/types/type";

const GoogleInput = ({
  icon,
  containerStyle,
  handlePress,
  initialLocation,
  textInputBackgroundColor,
}: GoogleInputProps) => {
  const googleplacekey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
  return (
    <View
      className={`flex flex-row items-center ${containerStyle} mb-5 justify-center z-50 rounded-xl relative px-3`}
    >
      <Image source={icon as any} className="w-5 h-5" />
      <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder=""
        debounce={200}
        styles={{
          textInputContainer: {
            alignContent: "center",
            justifyContent: "center",
            borderRadius: 20,
            marginHorizontal: 15,
            position: "relative",
            borderColor: "#D4D4D4",
            shadowColor: "#d4d4d4",
          },
          textInput: {
            fontSize: 16,
            fontWeight: "600",
            backgroundColor: textInputBackgroundColor ?? "#ffffff",
          },
          listView: {
            position: "relative",
            backgroundColor: "#FFFFFF",
            top: 0,
            width: "100%",
            zIndex: 999999,
            borderRadius: 10,
            shadowColor: "#000000",
            shadowOpacity: 0.8,
            shadowRadius: 2,
          },
        }}
        onPress={(data, details) => {
          handlePress({
            latitude: details?.geometry.location.lat!,
            longitude: details?.geometry.location.lng!,
            address: data?.description!,
          });
        }}
        query={{
          key: googleplacekey,
          language: "en",
        }}
        textInputProps={{
          placeholder: initialLocation ?? "Where do you want to go?",
          placeholderTextColor: "#868686",
        }}
      />
    </View>
  );
};

export default GoogleInput;
