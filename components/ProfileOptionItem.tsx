import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React from "react";
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from "react-native-size-matters";
import iconSet from "@expo/vector-icons/build/Fontisto";

const ProfileOptionItem = ({ title, icon, onClick }) => {
  return (
    <Pressable style={styles.container} onPress={onClick}>
      <View style={styles.subContainer}>
        <Image source={icon} style={styles.icon} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Image
        source={require("@/assets/images/chevron.png")}
        style={styles.right}
      />
    </Pressable>
  );
};

export default ProfileOptionItem;

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: moderateVerticalScale(20),
  },
  subContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: scale(20),
    height: scale(20),
  },
  title: {
    marginLeft: moderateScale(15),
    fontSize: moderateVerticalScale(18),
  },
  right: {
    width: scale(16),
    height: scale(16),
  },
});
