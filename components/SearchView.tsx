import React, { useState } from "react";

import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Pressable,
} from "react-native";
import Colors from "@/constants/Colors";
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from "react-native-size-matters";

const SearchInput = ({
  placeholder,
}: {
  placeholder?: string;
}) => {
  

  return (
    <Pressable style={styles.container}>
      <View style={styles.searchBox}>
        <Image
          style={styles.icon}
          source={require("@/assets/images/search.png")}
        />
        <Text style={styles.text}>{placeholder}</Text>
      </View>
    </Pressable>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  searchBox: {
    width: "90%",
    height: verticalScale(40),
    borderWidth: 0.4,
    marginTop: moderateVerticalScale(10),
    alignSelf: "center",
    borderRadius: moderateScale(30),
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: scale(18),
    height: scale(18),
    marginLeft: moderateScale(12),
  },
  text: {
    fontSize: moderateScale(16),
    color: Colors.lightGray,
    marginLeft: moderateScale(12),
  }
 
});
