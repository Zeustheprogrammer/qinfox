import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";
import Colors from "@/constants/Colors";

interface DropdownItem {
  id: string;
  name: string;
  regex: string;
}

const DropdownComponent = ({
  label,
  placeholder,
  value,
  setSelected,
  error,
  data,
}: {
  label: string;
  placeholder: string;
  value: string | null;
  setSelected: (value: string) => void;
  error?: string | boolean;
  data: DropdownItem[];
}) => {
  const [isFocus, setIsFocus] = useState(false);

  const getBorderColor = () => {
    if (error) {
      return Colors.primary;
    } else if (isFocus) {
      return Colors.primary;
    }
    return Colors.lightGray;
  };

  const getTextColor = () => {
    if (error) {
      return Colors.primary;
    }
    return Colors.primary;
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container]}>
          <Text
            style={[
              styles.label,
              { color: getTextColor() },
              isFocus && { fontWeight: "600" },
            ]}
          >
            {label}
          </Text>
          <Dropdown
            style={[styles.dropdown, { borderColor: getBorderColor() }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            search
            maxHeight={300}
            labelField="name"
            valueField="id"
            placeholder={!isFocus ? placeholder : "..."}
            searchPlaceholder="Search..."
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => setSelected(item.id)}
            selectedTextProps={{ numberOfLines: 1 }}
            value={value}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    width: "90%",
    alignSelf: "center",
    marginTop: moderateVerticalScale(20),
  },
  dropdown: {
    height: verticalScale(45),
    borderWidth: 0.4,
    borderRadius: moderateScale(10),
    paddingLeft: moderateScale(15),
    paddingRight: moderateScale(15),
    justifyContent: "center",
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: moderateScale(20),
    top: -moderateVerticalScale(8),
    position: "absolute",
    backgroundColor: Colors.secondary,
    paddingLeft: moderateScale(10),
    paddingRight: moderateScale(10),
    zIndex: 1,
  },
  placeholderStyle: {
    color: Colors.lightGray,
    fontSize: moderateScale(14),
  },
  selectedTextStyle: {
    fontSize: moderateScale(14),
  },
  iconStyle: {
    width: moderateScale(20),
    height: moderateScale(20),
    color: Colors.lightGray,
  },
  inputSearchStyle: {
    height: verticalScale(40),
    fontSize: moderateScale(14),
  },
  icon: {
    marginRight: moderateScale(16),
  },
});
