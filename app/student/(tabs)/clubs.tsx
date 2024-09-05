import React, { useCallback, useState, useMemo } from "react";
import { FlatList, RefreshControl, Text, View, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Colors from "@/constants/Colors";
import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyComponent";
import ClubCard from "@/components/ClubCard";

interface Club {
  id: string;
  name: string;
  tag_line: string;
  logo_url: string;
  description: string;
  moto: string;
}

const INITIAL_CLUBS: Club[] = Array(5)
  .fill({})
  .map((_, index) => ({
    id: `${index + 1}`,
    name: "",
    tag_line: "",
    logo_url: `https://example.com/logo${index + 1}.png`,
    description: "",
    moto: "",
  }));

const Clubs: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>(INITIAL_CLUBS);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchClubs = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "clubs"));
      const clubList: Club[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Club, "id">),
      }));
      setClubs(clubList);
    } catch (error) {
      console.error("Error fetching clubs: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchClubs();
    }, [fetchClubs])
  );

  const filteredClubs = useMemo(() => {
    if (!searchQuery) return clubs;
    const lowercasedQuery = searchQuery.toLowerCase();
    return clubs.filter((item) =>
      item.name.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery, clubs]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchClubs();
    setSearchQuery("");
    setRefreshing(false);
  }, [fetchClubs]);

  const renderClubCard = useCallback(
    ({ item }: { item: Club }) => <ClubCard item={item} loading={loading} />,
    [loading]
  );

  const keyExtractor = useCallback((item: Club) => item.id, []);

  const ListEmptyComponent = useCallback(
    () => (
      <EmptyState
        title="No Clubs Found"
        subtitle="No Club found. Please check back later."
      />
    ),
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Explore Clubs</Text>
        <SearchInput
          query={searchQuery}
          setQuery={setSearchQuery}
          placeholder="Search Clubs by Name"
        />
      </View>

      <FlatList
        data={filteredClubs}
        keyExtractor={keyExtractor}
        renderItem={renderClubCard}
        ListEmptyComponent={ListEmptyComponent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    padding: 16,
  },
  headerContainer: {
    marginBottom: 8,
  },
  headerText: {
    fontFamily: "sans-serif-light",
    color: Colors.primary,
    fontSize: 28,
    marginBottom: 8,
  },
});

export default Clubs;
