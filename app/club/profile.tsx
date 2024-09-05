import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { auth } from "@/lib/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import CustomButton from "@/components/CustomButton";
import {
  moderateScale,
  verticalScale,
  moderateVerticalScale,
} from "react-native-size-matters";
import { signOut } from "firebase/auth";

import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getData = async () => {
  const name = await AsyncStorage.getItem("name");
  const email = await AsyncStorage.getItem("email");
  return { name, email };
};

const Profile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
  } | null>({ name: "", email: "" });
  useEffect(() => {
    getData().then((data) => {
      return setUserData(data);
    });
  }, []);

  const handleSignOut = () => {
    signOut(auth);
    AsyncStorage.removeItem("role");
    AsyncStorage.removeItem("name");
    AsyncStorage.removeItem("email");
    router.replace("/");
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <FontAwesome5 name="user" size={64} color="black" />
          </View>
          <Text style={styles.nameText}>{userData?.name}</Text>
          <Text style={styles.emailText}>{userData?.email}</Text>
        </View>
        <CustomButton
          title="Logout"
          handlePress={handleSignOut}
          containerStyles={styles.logoutButtonContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: moderateVerticalScale(8),
  },
  avatarContainer: {
    width: moderateScale(32),
    height: moderateScale(32),
    backgroundColor: "gray",
    borderRadius: moderateScale(16),
    marginBottom: moderateVerticalScale(4),
    alignItems: "center",
    justifyContent: "center",
  },
  nameText: {
    fontSize: moderateScale(14),
    fontWeight: "bold",
    color: "gray",
  },
  emailText: {
    fontSize: moderateScale(12),
    color: "gray",
  },
  logoutButtonContainer: {
    width: "50%",
    marginTop: moderateVerticalScale(4),
    borderRadius: moderateScale(16),
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Profile;
