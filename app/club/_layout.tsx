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
import { View, StyleSheet } from "react-native";

export default function StudentLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          const iconSize = moderateScale(32);
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
          } else if (route.name === "add") {
            icon = (
              <MaterialIcons name="add-box" size={iconSize} color={color} />
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
          height: moderateVerticalScale(70),
        },
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Qinfox",
          headerStyle: {
            backgroundColor: Colors.secondary, // Background color of the header
          },
          headerTitleStyle: {
            color: Colors.primary, // Color of the title text
            fontSize: moderateScale(25), // Font size of the title text
            fontWeight: "600", // Font weight of the title text
          },
        }}
      />
      <Tabs.Screen
        name="faculty"
        options={{
          title: "Qinfox",
          headerStyle: {
            backgroundColor: Colors.secondary, // Background color of the header
          },
          headerTitleStyle: {
            color: Colors.white, // Color of the title text
            fontSize: moderateScale(20), // Font size of the title text
            fontWeight: "bold", // Font weight of the title text
          },
        }}
      />
      <Tabs.Screen
        name="add"
        options={{ headerShown: false, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="clubs"
        options={{
          title: "Qinfox",
          headerStyle: {
            backgroundColor: Colors.secondary, // Background color of the header
          },
          headerTitleStyle: {
            color: Colors.white, // Color of the title text
            fontSize: moderateScale(20), // Font size of the title text
            fontWeight: "bold", // Font weight of the title text
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Qinfox",
          headerStyle: {
            backgroundColor: Colors.secondary, // Background color of the header
          },
          headerTitleStyle: {
            color: Colors.white, // Color of the title text
            fontSize: moderateScale(20), // Font size of the title text
            fontWeight: "bold", // Font weight of the title text
          },
        }}
      />
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
});
