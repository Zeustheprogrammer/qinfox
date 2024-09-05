import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
  StyleSheet,
  Pressable,
} from "react-native";
import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import {
  moderateScale,
  scale,
  moderateVerticalScale,
} from "react-native-size-matters";
import moment from "moment";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";
import { useEffect, useState } from "react";

const EventCard = ({ item, isSaved, onSave, onRemove }: any) => {
  const router = useRouter();

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const {
    id,
    startDate,
    endDate,
    registrationEndDate,
    collegeName,
    minSize,
    maxSize,
    price,
    bannerUrl,
    name,
    location,
    isEvent,
    description,
    clubName,
    isPublic,
  } = item;
  const encodedBannerUrl = encodeURI(item.bannerUrl);

  const handlePress = () => {
    router.push({
      pathname: `/student/event/`,
      params: {
        id,
        collegeName,
        startDate: `${
          months[modStartDate.getMonth()]
        } ${modStartDate.getDate()}`,
        registrationEndDate: `${
          months[modRegistrationEndDate.getMonth()]
        }, ${modRegistrationEndDate.getDate()}, ${modRegistrationEndDate.getFullYear()} ${RegistrationEndTimeString}`,
        minSize,
        maxSize,
        price,
        encodedBannerUrl,
        name,
        location,
        isEvent,
        description,
        clubName,
        allow: isPublic
          ? "Any student from any college is allowed to register for this event."
          : "Only students from the" +
            collegeName +
            " college are allowed to register for this event.",
      },
    });
  };

  const modStartDate = new Date(
    startDate.seconds * 1000 + startDate.nanoseconds / 1000000
  );

  const modEndDate = new Date(
    endDate.seconds * 1000 + endDate.nanoseconds / 1000000
  );

  const modRegistrationEndDate = new Date(
    registrationEndDate.seconds * 1000 +
      registrationEndDate.nanoseconds / 1000000
  );

  const StartTimeString = modStartDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const EndTimeString = modEndDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const RegistrationEndTimeString = modRegistrationEndDate.toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.cardContainer, { margin: 10 }]}
    >
      <Image source={{ uri: bannerUrl }} style={styles.bannerImage} />

      <View style={styles.cardContent}>
        <Text style={styles.eventName}>{name}</Text>
        <View style={styles.eventDetails}>
          <AntDesign name="calendar" size={16} color={Colors.primary} />
          <Text style={styles.md}>
            {`${modStartDate.getDate()} ${
              months[modStartDate.getMonth()]
            } - ${modEndDate.getDate()} ${
              months[modEndDate.getMonth()]
            } | ${StartTimeString} - ${EndTimeString}`}
          </Text>
        </View>

        <View style={styles.eventBetween}>
          <View>
            <View style={styles.eventDetails}>
              <FontAwesome5
                name="university"
                size={18}
                color={Colors.primary}
              />
              <Text style={styles.md}>{collegeName}</Text>
            </View>
            <View style={styles.eventDetails}>
              <FontAwesome5
                name="user"
                size={16}
                color={Colors.primary}
                style={{ marginLeft: 2, marginRight: -2 }}
              />
              <Text
                style={styles.md}
              >{` Team Size: ${minSize} - ${maxSize}`}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.entryPriceText}>
              Entry: {+(Number(price) > 0) ? price + "Rs" : "Free"}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.absolute}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={18} color={Colors.primary} />
          <Text style={styles.locationText}>{location}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (isSaved) {
              onRemove(id);
            } else {
              onSave(id);
            }
          }}
          style={styles.favContainer}
        >
          {isSaved ? (
            <AntDesign name="heart" size={22} />
          ) : (
            <AntDesign name="hearto" size={22} />
          )}
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: moderateScale(24),
    paddingHorizontal: moderateScale(8),
    paddingTop: moderateVerticalScale(8),
    paddingBottom: moderateVerticalScale(4),
    marginBottom: moderateScale(8),
    elevation: 4,
  },
  bannerImage: {
    width: "100%",
    height: moderateVerticalScale(190),
    resizeMode: "cover",
    borderRadius: moderateScale(16),
  },
  cardContent: {
    marginTop: moderateVerticalScale(4),

    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateVerticalScale(4),
  },
  eventName: {
    fontWeight: "bold",
    fontSize: moderateScale(18),
  },
  eventDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: moderateScale(4),
  },
  eventBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: moderateVerticalScale(2),
  },
  md: {
    fontSize: moderateScale(14),
  },

  teamSize: {
    flexDirection: "row",
    alignItems: "center",
  },

  entryPriceText: {
    fontSize: moderateScale(14),
    fontWeight: "bold",
  },

  absolute: {
    position: "absolute",
    top: moderateVerticalScale(24),
    left: moderateScale(16),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "93%",
    alignSelf: "center",
    height: moderateVerticalScale(40),
  },

  locationContainer: {
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    borderRadius: moderateScale(20),
    flexDirection: "row",
    alignItems: "center",
    marginLeft: moderateScale(2),
  },
  locationText: {
    color: Colors.primary,
    marginLeft: moderateScale(2),
  },
  fav: {
    width: 24,
    height: 24,
    borderRadius: 10,
  },
  favContainer: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: moderateScale(8),
    borderRadius: moderateScale(15),
    flexDirection: "row",
    alignItems: "center",
  },
});

export default EventCard;
