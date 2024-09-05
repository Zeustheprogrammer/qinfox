import {
  View,
  Text,
  Linking,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from "react-native-size-matters";
import CustomIconButton from "@/components/CustomIconButton";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";
import TeamRegistrationModal from "@/components/TeamRegistrationModal"; // Adjust the import path as needed

interface EventPageProps {}

const EventPage: React.FC<EventPageProps> = () => {
  const router = useRouter();
  const [isEventSaved, setIsEventSaved] = useState(false);
  const [savedEventId, setSavedEventId] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredEventId, setRegisteredEventId] = useState("");
  const {
    id,
    startDate,
    endDate,
    registrationEndDate,
    collegeName,
    minSize,
    maxSize,
    price,
    encodedBannerUrl,
    name,
    location,
    description,
    clubName,
    allow,
  } = useLocalSearchParams();

  const saveEvent = async () => {
    try {
      await addDoc(collection(db, "saved_events"), {
        event_id: id,
        user_id: auth.currentUser?.uid,
      });
      getSavedEvents();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const getSavedEvents = async () => {
    const q = query(
      collection(db, "saved_events"),
      where("user_id", "==", auth.currentUser?.uid)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      querySnapshot.forEach((doc) => {
        if (doc.data().event_id === id) {
          setIsEventSaved(true);
          setSavedEventId(doc.id);
        }
      });
    } else {
      setIsEventSaved(false);
      setSavedEventId("");
    }
  };

  const removeSavedEvent = async () => {
    try {
      await deleteDoc(doc(db, "saved_events", savedEventId));
      getSavedEvents();
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  const handleRegisterPress = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleRegister = async (
    teamName: string,
    teamMembers: string[],
    referenceId: string
  ) => {
    console.log("Team Name:", teamName);
    console.log("Team Members:", teamMembers);
    console.log("Payment Reference ID:", referenceId);

    if (Number(price) > 0 && !referenceId) {
      Alert.alert("Error", "Please enter the payment reference ID");
      return;
    }

    const registrationData: any = {
      event_id: id,
      user_id: auth.currentUser?.uid,
      team_name: teamName,
      team_members: teamMembers,
    };

    if (Number(price) > 0) {
      registrationData.payment_reference_id = referenceId;
    }

    try {
      await addDoc(collection(db, "registered_events"), registrationData);
      Alert.alert("Success", "You have successfully registered for the event!");
      setIsModalVisible(false);
      getRegisteredEvents();
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert(
        "Error",
        "There was an error registering for the event. Please try again."
      );
    }
  };

  const getRegisteredEvents = async () => {
    const q = query(
      collection(db, "registered_events"),
      where("user_id", "==", auth.currentUser?.uid)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      querySnapshot.forEach((doc) => {
        if (doc.data().event_id === id) {
          setIsRegistered(true);
          setRegisteredEventId(doc.id);
        }
      });
    } else {
      setIsRegistered(false);
      setRegisteredEventId("");
    }
  };

  const removeRegistration = async () => {
    try {
      await deleteDoc(doc(db, "registered_events", registeredEventId));
      getRegisteredEvents();
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  useEffect(() => {
    getSavedEvents();
    getRegisteredEvents();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.contentDiv}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: decodeURI(encodedBannerUrl) }}
                style={styles.banner}
              />
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>{startDate}</Text>
              </View>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.eventName}>{name}</Text>
              <Text style={styles.clubName}>By {clubName}</Text>
              <Text style={styles.aboutTitle}>Event Details</Text>
              <Text style={styles.infoText}>
                Registration End Date & time: {registrationEndDate}
              </Text>
              <Text style={styles.infoText}>College Name: {collegeName}</Text>
              <Text style={styles.infoText}>
                Team Size: {minSize}-{maxSize}
              </Text>
              <Text style={styles.infoText}>
                Price: {Number(price) !== 0 ? `${price} Rs` : "Free"}
              </Text>
              <Text style={styles.infoText}>Location: {location}</Text>
              <Text style={styles.infoText}>{allow}</Text>
              <Text style={styles.aboutTitle}>Description</Text>
              <Text style={styles.aboutText}>{description}</Text>
            </View>
          </ScrollView>
        </View>
        <View style={styles.bottomView}>
          <CustomIconButton
            containerStyles={styles.saveBtn}
            handlePress={() => {
              if (isEventSaved) {
                removeSavedEvent();
              } else {
                saveEvent();
              }
            }}
          >
            {isEventSaved ? (
              <AntDesign name="heart" size={25} />
            ) : (
              <AntDesign name="hearto" size={25} />
            )}
          </CustomIconButton>
          <CustomButton
            title={isRegistered ? "Unregister" : "Register"}
            containerStyles={styles.registerButton}
            handlePress={
              isRegistered ? removeRegistration : handleRegisterPress
            }
          />
        </View>
      </View>
      <TeamRegistrationModal
        isVisible={isModalVisible}
        onClose={handleModalClose}
        minSize={minSize}
        maxSize={maxSize}
        price={price}
        onRegister={handleRegister}
      />
    </View>
  );
};

export default EventPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    marginTop: verticalScale(4),
  },
  contentContainer: {
    flex: 1,
  },
  contentDiv: {
    flex: 0.9,
  },
  scrollViewContent: {
    paddingHorizontal: moderateScale(4),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 12,
  },
  banner: {
    width: "100%",
    height: moderateVerticalScale(240),
    resizeMode: "stretch",
    borderRadius: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 18,
    color: Colors.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  infoContainer: {
    padding: 16,
  },
  eventName: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.primary,
  },
  clubName: {
    fontSize: 20,
    marginBottom: 16,
    color: Colors.primary,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.primary,
  },
  aboutText: {
    fontSize: 16,
    marginBottom: 16,
    color: Colors.primary,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.primary,
  },
  bottomView: {
    elevation: 4,
    flex: 0.1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    paddingBottom: moderateVerticalScale(10),
  },
  registerButton: {
    padding: 16,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    alignItems: "center",
    width: "65%",
  },
  saveBtn: {
    width: "25%",
    backgroundColor: Colors.secondary,
    borderWidth: 0.5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  dateContainer: {
    backgroundColor: Colors.primary,
    padding: moderateScale(10),
    borderRadius: 16,
    position: "absolute",
    bottom: -18, // Adjust as needed to place it below the image
    left: "42%",
    // Center horizontally based on the width of the container
  },
  dateText: {
    color: Colors.secondary,
    fontSize: moderateScale(16),
    marginHorizontal: moderateScale(4),
  },
  icon: {
    width: 32,
    height: 32,
  },
});
