import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/Colors"; // Adjust this path as necessary
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from "react-native-size-matters";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/lib/firebaseConfig";

const CustomImagePicker = ({ label, value, onChange, placeholder, error }) => {
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access media library is required!");
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      if (value) {
        const storageRef = ref(storage, value);
        deleteObject(storageRef)
          .then(() => {
            console.log("Image deleted successfully");
          })
          .catch(() => {
            console.log("Image deletion failed. Please try again.");
          });
      }
      uploadImage(selectedImageUri);
    }
  };

  const uploadImage = async (uri) => {
    setIsLoading(true);
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(
      storage,
      `images/${Date.now()}_${Math.random().toString(36).substring(7)}`
    );
    uploadBytes(storageRef, blob)
      .then(async (snapshot) => {
        const downloadURL = await getDownloadURL(snapshot.ref);
        onChange(downloadURL);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        alert("Image upload failed. Please try again.");
      });
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
      <TouchableOpacity style={styles.input} onPress={pickImage}>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : value ? (
          <Image source={{ uri: value }} style={styles.imagePreview} />
        ) : (
          <Text style={[styles.inputText, { color: Colors.lightGray }]}>
            {placeholder}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: verticalScale(150),
    borderWidth: 0.4,
    alignSelf: "center",
    marginTop: moderateVerticalScale(20),
    borderRadius: moderateScale(10),
    justifyContent: "center",
    padding: moderateScale(16),
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
    zIndex: 100,
  },
  input: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputText: {
    fontSize: moderateScale(14),
    color: Colors.primary,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(10),
  },
});

export default CustomImagePicker;
