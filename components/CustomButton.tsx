import Colors from "@/constants/Colors";
import React from "react";
import { ActivityIndicator, Text, Pressable, StyleSheet } from "react-native";
import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";

const CustomButton = ({
  title = "Button",
  handlePress = () => {},
  containerColor = Colors.primary,
  textColor = Colors.secondary,
  containerStyles = {},
}) => {
  return (
    <Pressable
      onPress={handlePress}
      style={[styles.btn, { backgroundColor: containerColor }, containerStyles]}
    >
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
    </Pressable>
  );
};

export default CustomButton;

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
