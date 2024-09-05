import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  verticalScale,
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";

type FormFieldProps = {
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
  value?: string;
  error?: string | boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  isLarge?: boolean;
};

import Colors from "@/constants/Colors";

const CustomInputField = ({
  label,
  placeholder,
  secureTextEntry = false,
  onChangeText,
  value,
  error,
  keyboardType,
  isLarge,
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const getBorderColor = () => {
    if (error) {
      return Colors.red;
    } else if (focused) {
      return Colors.primary;
    }
    return Colors.lightGray;
  };

  const getTextColor = () => {
    if (error) {
      return Colors.red;
    }
    return Colors.primary;
  };

  return (
    <View
      style={[
        styles.input,
        {
          borderColor: getBorderColor(),
          height: isLarge ? verticalScale(100) : verticalScale(45),
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: getTextColor() },
          focused && { fontWeight: "600" },
        ]}
      >
        {label}
      </Text>

      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Colors.lightGray}
        style={[
          styles.textInput,
          {
            textAlignVertical: isLarge ? "top" : "center",
            paddingTop: isLarge ? verticalScale(10) : 0,
            paddingBottom: isLarge ? verticalScale(10) : 0,
          },
        ]}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry && !showPassword}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        value={value}
        multiline={isLarge}
      />

      {secureTextEntry && (
        <Pressable
          onPress={() => setShowPassword(!showPassword)}
          style={styles.icon}
        >
          <MaterialIcons
            name={showPassword ? "visibility-off" : "visibility"}
            size={24}
            color={Colors.lightGray}
          />
        </Pressable>
      )}
    </View>
  );
};

export default CustomInputField;

const styles = StyleSheet.create({
  input: {
    width: "90%",
    borderWidth: 0.4,
    alignSelf: "center",
    marginTop: moderateVerticalScale(20),
    borderRadius: moderateScale(10),
    paddingLeft: moderateScale(15),
    paddingRight: moderateScale(15),
    justifyContent: "center",
  },
  title: {
    fontSize: moderateScale(14),
    alignSelf: "flex-start",
    marginLeft: moderateScale(20),
    top: -moderateVerticalScale(10),
    position: "absolute",
    backgroundColor: Colors.secondary,
    paddingLeft: moderateScale(10),
    paddingRight: moderateScale(10),
  },
  textInput: {
    fontSize: moderateScale(14),
    flex: 1,
    color: Colors.primary,
  },
  icon: {
    position: "absolute",
    right: moderateScale(16),
    top: moderateVerticalScale(14),
  },
});
