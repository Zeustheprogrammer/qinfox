import {
  View,
  Text,
  Image,
  Linking,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { commonStyles } from "@/styles/commonStyles";
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from "react-native-size-matters";
import Colors from "@/constants/Colors";

const ClubPage = () => {
  const router = useRouter();
  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Error", "Unable to open URL");
    }
  };

  const { id, name, tag_line, logo_url, description, moto, social_url } =
    useLocalSearchParams();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View style={styles.clubContainer}>
            <Image source={{ uri: logo_url.toString() }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.tagLine}>{tag_line}</Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.moto}>{moto}</Text>
            <Text style={styles.aboutTitle}>About</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          <CustomButton
            title="Connect"
            containerStyles={styles.connectButton}
            handlePress={() =>
              openLink(Array.isArray(social_url) ? social_url[0] : social_url)
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    marginTop: verticalScale(4),
  },
  scrollViewContent: {
    paddingHorizontal: moderateScale(4),
    marginBottom: moderateVerticalScale(8),

  },
  contentContainer: {
    padding: moderateScale(8),
    marginBottom: moderateVerticalScale(8),
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E7E0E0",
    padding: moderateScale(10),
    borderRadius: 16,
    marginBottom: moderateVerticalScale(12),
  },
  backButtonText: {
    marginLeft: moderateScale(8),
    fontSize: moderateScale(16),
    color: "black",
  },
  clubContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 24,
    padding: moderateScale(12),
    marginBottom: moderateVerticalScale(12),
  },
  image: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: moderateScale(50),
    marginRight: moderateScale(16),
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: moderateScale(20),
    marginBottom: moderateVerticalScale(4),
  },
  tagLine: {
    color: "#6B7280", // Tailwind gray-600
    marginBottom: moderateVerticalScale(4),
    flexWrap: "wrap",
  },
  infoContainer: {
    padding: moderateScale(10),
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 24,
   
  },
  moto: {
    fontSize: moderateScale(18),
    fontStyle: "italic",
    marginBottom: moderateVerticalScale(12),
    color: Colors.primary,
  },
  aboutTitle: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    marginBottom: moderateVerticalScale(8),
    color: Colors.primary,
  },
  description: {
    fontSize: moderateScale(16),
    marginBottom: moderateVerticalScale(16),
    color: Colors.primary,
  },
  connectButton: {
    padding: moderateScale(16),
    backgroundColor: Colors.primary,
    borderRadius: 16,
    alignItems: "center",
    width: "100%",
  },
});

export default ClubPage;
