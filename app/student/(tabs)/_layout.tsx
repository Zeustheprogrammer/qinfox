import { Tabs } from "expo-router";
import {
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import {
  moderateVerticalScale,
  moderateScale,
} from "react-native-size-matters";
import { Text, View, StyleSheet } from "react-native";

export default function StudentLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          const iconSize = moderateScale(28);
          let icon;

          if (route.name === "home") {
            icon = <Entypo name="home" size={iconSize} color={color} />;
          } else if (route.name === "faculty") {
            icon = (
              <MaterialIcons
                name="person-search"
                size={iconSize}
                color={color}
              />
            );
          } else if (route.name === "clubs") {
            icon = (
              <MaterialCommunityIcons
                name="account-group"
                size={iconSize}
                color={color}
              />
            );
          } else {
            icon = <Ionicons name="person" size={iconSize} color={color} />;
          }

          return (
            <View style={[styles.iconContainer, focused && styles.activeTab]}>
              {icon}
            </View>
          );
        },
        tabBarActiveTintColor: Colors.primary, // Active tab icon color
        tabBarInactiveTintColor: Colors.lightGray, // Inactive tab icon color
        tabBarShowLabel: false, // Hide tab labels
        tabBarStyle: {
          backgroundColor: Colors.secondary, // Background color for the tab bar
          width: "100%",
          height: moderateVerticalScale(50),
        },
        headerTitle: () => (
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Qinfox</Text>
          </View>
        ),
        headerStyle: {
          height: moderateVerticalScale(80),
        },
        headerTitleAlign: "center",
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Qinfox</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen name="faculty" />
      <Tabs.Screen name="clubs" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  activeTab: {
    borderTopWidth: moderateScale(3), // Thickness of the top border
    borderTopColor: Colors.primary, // Color of the top border
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary, // Adjust the color based on your theme
  },
});
