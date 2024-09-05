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

import EventCard from "@/components/EventCard";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyComponent";
import {
  collection,
  getDocs,
  query,
  where,
  documentId,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebaseConfig";
import Colors from "@/constants/Colors";
import SearchInput from "@/components/SearchInput";
import { useFocusEffect } from "@react-navigation/native";
import SearchView from "@/components/SearchView";

const SavedEvents = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [savedEvents, setSavedEvents] = useState<any[]>([]);

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
    try {
        setLoading(true);
      const q = query(
        collection(db, "saved_events"),
        where("user_id", "==", auth.currentUser?.uid)
      );

      const querySnapshot = await getDocs(q);
      const savedEventIds = querySnapshot.docs.map(
        (doc) => doc.data().event_id
      );
      if (savedEventIds.length > 0) {
        const eventsQuery = query(
          collection(db, "events"),
          where(documentId(), "in", savedEventIds)
        );

        const eventsSnapshot = await getDocs(eventsQuery);
        const events = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSavedEvents(events);
      } else {
        setSavedEvents([]);
      }
    } catch (e) {
      console.error("Error fetching saved events: ", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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

  useFocusEffect(
    useCallback(() => {
      getSavedEvents();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    getSavedEvents();
  };

  return (
    <View style={styles.container}>
      <View style={styles.flatListContainer}>
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={savedEvents}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <EventCard
              item={item}
              isSaved={savedEvents.some((savedItem) => savedItem.id === item.id)}
              onSave={saveEvent}
              onRemove={removeSavedEvent}
            />
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Saved Events Found"
              
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
};

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
export default SavedEvents;
