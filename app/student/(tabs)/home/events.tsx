import { useRouter } from "expo-router";
import {
  FlatList,
  RefreshControl,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import {
  scale,
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from "react-native-size-matters";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EventCard from "@/components/EventCard";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyComponent";
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";
import Colors from "@/constants/Colors";
import SearchInput from "@/components/SearchInput";
import { useFocusEffect } from "@react-navigation/native";
import SearchView from "@/components/SearchView";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [savedEvents, setSavedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getEvents = async () => {
    const querySnapshot = await getDocs(collection(db, "events"));
    const events: any[] = [];
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return events;
  };

  const saveEvent = async (id: string) => {
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
    const savedEventIds = querySnapshot.docs.map((doc) => doc.data().event_id);
    setSavedEvents(savedEventIds);
  };

  const removeSavedEvent = async (id: string) => {
    try {
      const q = query(
        collection(db, "saved_events"),
        where("user_id", "==", auth.currentUser?.uid),
        where("event_id", "==", id)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        await deleteDoc(doc(db, "saved_events", docId));
        getSavedEvents();
      }
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const events = await getEvents();
      setEvents(events);
    } catch (error) {
      console.error("Error fetching events: ", error);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchEvents();
      getSavedEvents();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEvents();
    await getSavedEvents();
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Upcoming Events</Text>

        <View style={styles.iconContainer}>
          <Image
            source={require("@/assets/images/search.png")}
            style={styles.searchIcon}
          />
          <Image
            source={require("@/assets/images/setting.png")}
            style={styles.icon}
          />
        </View>
      </View>
      <View style={styles.flatListContainer}>
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={events}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <EventCard item={item} isSaved={savedEvents.includes(item.id)}
          onSave={saveEvent}
          onRemove={removeSavedEvent}/>}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Events Found"
              subtitle="No events found. Please check back later."
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
      <Loader visible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  header: {
    width: "90%",
    marginTop: moderateVerticalScale(8),
    marginBottom: moderateVerticalScale(0),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    paddingBottom: moderateVerticalScale(8),
  },
  headerText: {
    fontSize: moderateScale(24),

    marginBottom: moderateVerticalScale(4),
    fontFamily: "KellySlab",
  },
  flatListContainer: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  icon: {
    width: scale(24),
    height: scale(24),
  },

  searchIcon: {
    width: scale(22),
    height: scale(22),
  },

  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: moderateScale(16),
  },
});
