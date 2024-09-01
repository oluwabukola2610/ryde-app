import React from "react";
import { Text, TouchableOpacity } from "react-native";

import { ButtonProps } from "@/types/type";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  IconLeft,
  IconRight,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`p-3 rounded-full flex flex-row justify-center items-center  ${containerStyles} 
      shadow-md shadow-neutral-400/70}`}
    >
      {IconLeft && <IconLeft />}

      <Text className={` text-lg ${textStyles}`}>{title}</Text>
      {IconRight && <IconRight />}
    </TouchableOpacity>
  );
};

export default CustomButton;
