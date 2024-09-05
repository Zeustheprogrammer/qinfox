import React, { useCallback, useEffect, useState, useMemo } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import FacultyCard from "@/components/FacultyCard"; // Adjust the import path as needed
import Colors from "@/constants/Colors"; // Adjust the import path as needed
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyComponent";
import { useFocusEffect } from "expo-router";

interface Faculty {
  id: string;
  name: string;
  expertise: string[];
  profile: string;
  email: string;
  linkedIn: string;
}

const INITIAL_faculty: Faculty[] = Array(5)
  .fill({})
  .map((_, index) => ({
    id: `${index + 1}`,
    name: "",
    expertise: [],
    profile: `https://example.com/profile${index + 1}.png`,
    email: "",
    linkedIn: "",
  }));

const Faculty = () => {
  const [searchInput, setSearchInput] = useState("");
  const [faculty, setFaculty] = useState(INITIAL_faculty);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFaculty = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "faculty"));
      const facultyList: Faculty[]  = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        expertise: doc.data().expertise,
        profile: doc.data().profile,
        email: doc.data().email,
        linkedIn: doc.data().linkedIn,
      }));
        
      setFaculty(facultyList);
    } catch (error) {
      console.error("Error fetching faculty: ", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFaculty();
    }, [fetchFaculty])
  );

  const filteredFaculty = useMemo(() => {
    if (searchInput) {
      const lowercasedQuery = searchInput.toLowerCase();
      return faculty.filter(
        (item) =>
          item.name.toLowerCase().includes(lowercasedQuery) ||
          item.expertise.some((expertise) =>
            expertise.toLowerCase().includes(lowercasedQuery)
          )
      );
    }
    return faculty;
  }, [searchInput, faculty]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFaculty();
    setRefreshing(false);
  }, [fetchFaculty]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Explore Faculty</Text>
        <SearchInput
          query={searchInput}
          setQuery={setSearchInput}
          placeholder="Search Faculty by Name or Expertise"
        />
      </View>

      <FlatList
        data={filteredFaculty}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <FacultyCard item={item} loading={loading} />}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Faculty Found"
            subtitle="Please Try again later"
          />
        )}
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

export default Faculty;
