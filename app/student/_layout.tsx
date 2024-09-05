import { Stack } from "expo-router";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";

const StudentLayout = () => {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="event"
        options={{
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <AntDesign name="left" size={22} color={Colors.primary} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          ),
          headerTitle: "Event",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="club"
        options={{
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <AntDesign name="left" size={22} color={Colors.primary} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          ),
          headerTitle: "Club",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="saved_events"
        options={{
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <AntDesign name="left" size={22} color={Colors.primary} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          ),
          headerTitle: "Saved Events",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="registered_events"
        options={{
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <AntDesign name="left" size={22} color={Colors.primary} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          ),
          headerTitle: "Registered Events",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
};

export default StudentLayout;

const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    marginLeft: 6,
    fontSize: 16,
    color: Colors.primary,
  },
});
