import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";

const CustomSwitch = ({
  label,
  value,
  onValueChange,
  error,
  labelStyle,
  containerStyle,
  switchStyle,
  thumbColorOn = "#f5dd4b",
  thumbColorOff = "#f4f3f4",
  trackColorOn = "#81b0ff",
  trackColorOff = "#767577",
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor={value ? thumbColorOn : thumbColorOff}
        trackColor={{ false: trackColorOff, true: trackColorOn }}
        style={[styles.switch, switchStyle]}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: moderateScale(20),
    marginTop: moderateVerticalScale(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateVerticalScale(1),
    paddingLeft: moderateScale(24),
    paddingRight: moderateScale(16),
  },

  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

export default CustomSwitch;
