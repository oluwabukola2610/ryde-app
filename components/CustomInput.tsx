import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Image,
  Platform,
  Keyboard,
} from "react-native";

import { InputFieldProps } from "@/types/type";

const CustomInput = ({
  title,
  value,
  otherstyles,
  handlechange,
  keyboardType,
  placeholder,
  inputstyle,
  textstyle,
  iconName,
  editable,
}: InputFieldProps) => {
  const [showpassword, setShowpassword] = useState(false);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={`space-y-2 ${otherstyles}`}>
          <Text className={` font-JakartaBold text-lg ${textstyle}`}>
            {title}
          </Text>
          <View
            className={`${inputstyle}  border-neutral-100
              bg-neutral-50 rounded-full px-3
             w-full border focus:border-primary-500 flex items-center flex-row`}
          >
            {iconName && (
              <Image source={iconName as any} alt="" className="w-6 h-6" />
            )}
            <TextInput
              className={`text-base 
             font-light flex-1 lowercase p-3 text-left`}
              editable={editable}
              value={value}
              onChangeText={handlechange}
              keyboardType={keyboardType}
              secureTextEntry={title === "Password" && !showpassword}
              placeholder={placeholder}
              placeholderTextColor="#A7A9AD"
            />
            {title === "Password" && (
              <TouchableOpacity onPress={() => setShowpassword(!showpassword)}>
                <Ionicons
                  name={showpassword ? "eye-off" : "eye"}
                  size={24}
                  className=""
                  color="#A7A9AD"
                />
              </TouchableOpacity>
            )}
          </View>
          {/* {error && (
            <Text className={`font-semibold text-base text-red-800 `}>{error}</Text>
          )} */}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CustomInput;
