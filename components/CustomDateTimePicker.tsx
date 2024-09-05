import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Colors from "@/constants/Colors"; // Adjust this path as necessary
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from "react-native-size-matters";

const CustomDateTimePicker = ({
  label,
  value,
  onChange,
  placeholder,
  error,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const showDateTimePicker = () => {
    setIsVisible(true);
  };

  const handleConfirm = (selectedDate: Date) => {
    setIsVisible(false);
    onChange(selectedDate);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  const getBorderColor = () => {
    if (error) {
      return Colors.primary;
    } else if (value) {
      return Colors.primary;
    }
    return Colors.lightGray;
  };

  return (
    <View style={[styles.container, { borderColor: getBorderColor() }]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.input} onPress={showDateTimePicker}>
        <Text
          style={[
            styles.inputText,
            { color: value ? Colors.primary : Colors.lightGray },
          ]}
        >
          {value ? value.toLocaleString() : placeholder}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: verticalScale(45),
    borderWidth: 0.4,
    alignSelf: "center",
    marginTop: moderateVerticalScale(20),
    borderRadius: moderateScale(10),
    justifyContent: "center",
    paddingLeft: moderateScale(15),
    paddingRight: moderateScale(15),
  },
  label: {
    fontSize: moderateScale(14),
    alignSelf: "flex-start",
    marginLeft: moderateScale(20),
    top: -moderateVerticalScale(9),
    position: "absolute",
    backgroundColor: Colors.secondary,
    paddingLeft: moderateScale(10),
    paddingRight: moderateScale(10),
  },
  input: {
    flex: 1,
    justifyContent: "center",
  },
  inputText: {
    fontSize: moderateScale(14),
    color: Colors.primary,
  },
});

export default CustomDateTimePicker;
