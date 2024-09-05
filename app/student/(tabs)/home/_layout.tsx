import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import Colors from "@/constants/Colors";
import { moderateVerticalScale } from "react-native-size-matters";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

const Home = () => {
  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarActiveTintColor: "black",

        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
          textTransform: "capitalize",
        },
        tabBarIndicatorStyle: { backgroundColor: Colors.primary, height: 3 },
      }}
    >
      <MaterialTopTabs.Screen name="events" options={{ title: "events" }} />

      <MaterialTopTabs.Screen
        name="notification"
        options={{ title: "notifications" }}
      />
    </MaterialTopTabs>
  );
};

export default Home;
