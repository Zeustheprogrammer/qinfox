import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import React from "react";
import { moderateScale, scale } from "react-native-size-matters";
import Colors from "@/constants/Colors";

const Loader = ({ visible }: { visible: boolean }) => {
  return (
    <Modal transparent visible={visible} style={{ flex: 1 }}>
      <View
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
      >
        <View
          style={{
            width: scale(80),
            height: scale(80),
            backgroundColor: Colors.secondary,
            borderRadius: moderateScale(10),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"large"} color={Colors.primary} />
        </View>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({});
