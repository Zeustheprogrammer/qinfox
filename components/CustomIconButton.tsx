import Colors from "@/constants/Colors";
import React from "react";
import { ActivityIndicator, Text, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";

const CustomIconButton = ({
  children,
  handlePress = () => {},
  containerColor = Colors.primary,
  textColor = Colors.secondary,
  containerStyles = {},
}: {
  children: React.ReactNode,
  handlePress?: () => void,
  containerColor?: string,
  textColor?: string,
  containerStyles?: object,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.btn, { backgroundColor: containerColor }, containerStyles]}
    >
      {children}
    </TouchableOpacity>
  );
};

export default CustomIconButton;

const styles = StyleSheet.create({
  btn: {
    width: "90%",
    height: verticalScale(50),
    marginTop: moderateVerticalScale(20),
    alignSelf: "center",
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: "500",
  },
});
