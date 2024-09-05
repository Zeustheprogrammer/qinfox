import { Link, useRouter } from "expo-router";
import {
  FlatList,
  Image,
  RefreshControl,
  Button,
  Text,
  View,
  StyleSheet,
} from "react-native";
import {
  scale,
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EventCard from "@/components/EventCard";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyComponent";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Colors from "@/constants/Colors";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
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

  const fetchEvents = async () => {
    await getEvents()
      .then((events) => setEvents(events))
      .catch((error) => console.error("Error fetching events: ", error))
      .finally(() => setLoading(false));
    console.log("Events: ", events);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // const [searchQuery, setSearchQuery] = useState("");
  // const [filteredEvents, setFilteredEvents] = useState(events);
  // const [loading, setLoading] = useState(true);

  // const [refreshing, setRefreshing] = useState(false);

  // useEffect(() => {
  //   if (searchQuery) {
  //     const lowercasedQuery = searchQuery.toLowerCase();
  //     const filtered = events.filter((item) =>
  //       item.name.toLowerCase().includes(lowercasedQuery)
  //     );
  //     setFilteredEvents(filtered);
  //   } else {
  //     setFilteredEvents(events);
  //   }
  // }, [searchQuery, events]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEvents();
    // setSearchQuery(""); // Reset search query on refresh
    setRefreshing(false);
  }, [fetchEvents]);

  // ...

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <EventCard item={item} />}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerText}>Explore, Engage,</Text>
            <Text style={styles.headerText}>Enjoy Events</Text>
          </View>
        )}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    paddingHorizontal: moderateScale(16),
  },
  header: {
    marginBottom: moderateVerticalScale(24),
    paddingHorizontal: moderateScale(4),
  },
  headerText: {
    fontSize: moderateScale(24),
    marginBottom: moderateVerticalScale(8),
    fontFamily: "KellySlab",
  },
});
