import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Faculty = () => {
  return (
    <View>
      <Text>Faculty</Text>
    </View>
  );
};

export default Faculty;

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

// export default function Faculty() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const { faculty, fetchFaculty, loading } = useEventStore();
//   const [filteredFaculty, setFilteredFaculty] = useState(faculty);

//   const memoizedFetchEvents = useCallback(() => {
//     fetchFaculty();
//   }, [fetchFaculty]);

//   useEffect(() => {
//     memoizedFetchEvents();
//   }, [memoizedFetchEvents]);

//   useEffect(() => {
//     if (searchQuery) {
//       const lowercasedQuery = searchQuery.toLowerCase();
//       const filtered = faculty.filter(
//         (item) =>
//           item.name.toLowerCase().includes(lowercasedQuery) ||
//           item.expertise.some((expertise) =>
//             expertise.toLowerCase().includes(lowercasedQuery)
//           )
//       );
//       setFilteredFaculty(filtered);
//     } else {
//       setFilteredFaculty(faculty);
//     }
//   }, [searchQuery, faculty]);

//   const [refreshing, setRefreshing] = useState(false);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await fetchFaculty();
//     setSearchQuery(""); // Reset search query on refresh
//     setRefreshing(false);
//   }, [fetchFaculty]);

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
//         data={filteredFaculty}
//         keyExtractor={(item) => item.id}
//         showsVerticalScrollIndicator={false}
//         renderItem={({ item }) => <FacultyCard item={item} />}
//         ListHeaderComponent={() => (
//           <View className="mb-6 space-y-6">
//             <View className="mb-4">
//               <Text className="text-primary font-KellySlab text-4xl mb-1">
//                 Explore, Faculty
//               </Text>
//             </View>
//             <SearchInput
//               onSearch={(query) => setSearchQuery(query)}
//               initialQuery=""
//               placeholder="Search Faculty by name or expertise"
//             />
//           </View>
//         )}
//         ListEmptyComponent={() => (
//           <EmptyState
//             title="No Faculty Found"
//             subtitle="No faculty found. Please check back later."
//           />
//         )}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       />
//     </SafeAreaView>
//   );
// }
