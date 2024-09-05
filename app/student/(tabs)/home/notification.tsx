import React, { useCallback, useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Linking,
} from "react-native";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { format } from "date-fns";
import { useFocusEffect } from "expo-router";
import { commonStyles } from "@/styles/commonStyles";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

interface Notification {
  id: string;
  name: string;
  link: string;
  createdAt: Timestamp;
}

const INITIAL_NOTIFICATIONS: Notification[] = Array(5)
  .fill({})
  .map((_, index) => ({
    id: `${index}`,
    name: "",
    link: "",
    createdAt: Timestamp.now(),
  }));

const NotificationComponent: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(
    INITIAL_NOTIFICATIONS
  );
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const q = query(
        collection(db, "notifications"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const fetchedNotifications = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Notification, "id">),
      }));
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications])
  );

  const shimmerProps = useMemo(
    () => ({
      shimmerColors: ["#ebebeb", "#c5c5c5", "#ebebeb"],
      shimmerStyle: { borderRadius: 4 },
    }),
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: Notification }) => {
      const { name, link, createdAt } = item;
      const formattedDate = format(
        new Date(createdAt.seconds * 1000),
        "MMMM dd, yyyy"
      );

      return (
        <TouchableOpacity
          style={commonStyles.cardContainer}
          onPress={() => Linking.openURL(link)}
        >
          {loading ? (
            <>
              <ShimmerPlaceHolder
                style={[commonStyles.cardTitle, { width: "80%" }]}
                {...shimmerProps}
              />
              <ShimmerPlaceHolder
                style={[
                  commonStyles.cardSubtitle,
                  { width: "60%", marginTop: 8 },
                ]}
                {...shimmerProps}
              />
            </>
          ) : (
            <>
              <Text style={commonStyles.cardTitle}>{name}</Text>
              <Text style={commonStyles.cardSubtitle}>{formattedDate}</Text>
            </>
          )}
        </TouchableOpacity>
      );
    },
    [loading, shimmerProps]
  );

  const keyExtractor = useCallback((item: Notification) => item.id, []);

  const ListEmptyComponent = useCallback(
    () => <Text style={commonStyles.emptyText}>No notifications found.</Text>,
    []
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
  },
});

export default NotificationComponent;
