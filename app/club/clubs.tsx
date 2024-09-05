import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Clubs = () => {
  return (
    <View>
      <Text>Clubs</Text>
    </View>
  );
};

export default Clubs;

const styles = StyleSheet.create({});

// import { useAuth, useUser } from "@clerk/clerk-expo";
// import { FlatList, RefreshControl, Text, View } from "react-native";
// import { useCallback, useEffect, useState } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import useEventStore from "@/store/store.js";
// import Loader from "@/components/Loader";
// import FacultyCard from "@/components/FacultyCard";
// import SearchInput from "@/components/SearchInput";
// import EmptyState from "@/components/EmptyComponent";
// import ClubCard from "@/components/ClubCard";

// export default function Clubs() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const { clubs, fetchClubs, loading } = useEventStore();
//   const [filteredClubs, setFilteredClubs] = useState(clubs);

//   const memoizedFetchClubs = useCallback(() => {
//     fetchClubs();
//   }, [fetchClubs]);

//   useEffect(() => {
//     memoizedFetchClubs();
//   }, [memoizedFetchClubs]);

//   useEffect(() => {
//     if (searchQuery) {
//       const lowercasedQuery = searchQuery.toLowerCase();
//       const filteredClubs = clubs.filter((item) =>
//         item.name.toLowerCase().includes(lowercasedQuery)
//       );
//       setFilteredClubs(filteredClubs);
//     } else {
//       setFilteredClubs(clubs);
//     }
//   }, [searchQuery, clubs]);

//   const [refreshing, setRefreshing] = useState(false);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await fetchClubs();
//     setSearchQuery(""); // Reset search query on refresh
//     setRefreshing(false);
//   }, [fetchClubs]);

//   if (loading) return <Loader size="large" color="black" />;

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         backgroundColor: "#F9F9F9",
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//       }}
//     >
//       <FlatList
//         data={filteredClubs}
//         keyExtractor={(item) => item.id}
//         showsVerticalScrollIndicator={false}
//         renderItem={({ item }) => <ClubCard item={item} />}
//         ListHeaderComponent={() => (
//           <View className="mb-6 space-y-6">
//             <View className="mb-4">
//               <Text className="text-primary font-KellySlab text-4xl mb-1">
//                 Explore, Clubs
//               </Text>
//             </View>
//             <SearchInput
//               onSearch={(query) => setSearchQuery(query)}
//               initialQuery=""
//               placeholder="Search Clubs"
//             />
//           </View>
//         )}
//         ListEmptyComponent={() => (
//           <EmptyState
//             title="No Clubs Found"
//             subtitle="No Club found. Please check back later."
//           />
//         )}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       />
//     </SafeAreaView>
//   );
// }
