import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { router, useFocusEffect } from "expo-router";

import Colors from "@/constants/Colors";
import { doc, getDoc } from "firebase/firestore";
import Loader from "@/components/Loader";
import ProfileOptionItem from "@/components/ProfileOptionItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";

const Profile = () => {
  const [userDetails, setUserDetails] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const getProfile = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDetails = await getDoc(doc(db, "users", user.uid));
        console.log(userDetails.data());
        setUserDetails(userDetails.data());
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getProfile();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <TouchableOpacity style={{ marginLeft: 10, marginTop: 15 }}>
          <Image
            source={require("@/assets/images/user.png")}
            style={styles.profile}
          />
        </TouchableOpacity>
        <Text style={styles.name}>{userDetails ? userDetails.name : "NA"}</Text>
        <Text style={styles.email}>
          {userDetails ? userDetails.email : "NA"}
        </Text>
        <TouchableOpacity style={styles.editBtn}>
          <Text>Edit Profile</Text>
        </TouchableOpacity>
        <View style={styles.settings}>
          <ProfileOptionItem
            icon={require("@/assets/images/event.png")}
            title={"Registered Events"}
            onClick={() => {
              router.navigate({ pathname: "/student/registered_events" });
            }}
          />
          <ProfileOptionItem
            icon={require("@/assets/images/event.png")}
            title={"Saved Events"}
            onClick={() => {
              router.navigate({ pathname: "/student/saved_events" });
            }}
          />
          <ProfileOptionItem
            icon={require("@/assets/images/contact-mail.png")}
            title={"Contact Us"}
            onClick={() => {
              Linking.openURL("mailto:abbojushanthan@gmail.com");
            }}
          />
          <ProfileOptionItem
            icon={require("@/assets/images/power.png")}
            title={"Logout"}
            onClick={() => {
              AsyncStorage.removeItem("name");
              AsyncStorage.removeItem("email");
              AsyncStorage.removeItem("role");
              signOut(auth);
              router.navigate({ pathname: "/" });
            }}
          />
        </View>
      </View>
      <Loader visible={loading} />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  mainView: {
    flex: 1,
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginLeft: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.primary,
    marginTop: 5,
    marginLeft: 10,
  },
  email: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.primary,
    marginTop: 2,
    marginLeft: 10,
  },
  editBtn: {
    width: 200,
    height: 40,
    borderWidth: 0.4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 12,
    marginLeft: 10,
  },
  settings: {
    marginTop: 20,
  },
});
