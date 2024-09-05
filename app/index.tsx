import { View, Text, StyleSheet, Image } from "react-native";
import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";

import React, { useEffect } from "react";
import Colors from "@/constants/Colors";
import { Href, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Splash = () => {
  useEffect(() => {
    setTimeout(() => {
      getData();
    }, 2000);
  }, []);
  const getData = async () => {
    let type = await AsyncStorage.getItem("role");
    if (type == null) {
      router.replace("/auth");
    }
    if (type == "student") {
      router.replace("/student");
    } else if (type == "club") {
      router.replace("/club");
    }  else {
      router.replace("/auth");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/icon.png")}
        style={styles.logo}
      />
      <Text style={styles.name}>QINFOX</Text>
      <Text style={styles.slogan}>Syncing Students with College Pulse</Text>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: scale(100),
    height: verticalScale(100),
  },
  name: {
    fontSize: moderateScale(35),
    fontWeight: "600",
    marginTop: moderateVerticalScale(10),
    color: Colors.primary,
  },
  slogan: {
    fontSize: moderateScale(16),
    fontStyle: "italic",
    position: "absolute",
    bottom: moderateVerticalScale(80),
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});
