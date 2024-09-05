import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  StyleSheet,
} from "react-native";
import React, { useMemo } from "react";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { commonStyles } from "@/styles/commonStyles";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const FacultyCard = ({ item, loading }: any) => {
  const { name, email, expertise, profile, linkedIn } = item;

  const shimmerProps = useMemo(
    () => ({
      shimmerColors: ["#ebebeb", "#c5c5c5", "#ebebeb"],
      shimmerStyle: { borderRadius: 4 },
    }),
    []
  );

  return (
    <View style={[commonStyles.cardContainer, styles.container]}>
      <View>
        {loading ? (
          <ShimmerPlaceHolder style={styles.image} {...shimmerProps} />
        ) : (
          <Image source={{ uri: profile }} style={styles.image} />
        )}
      </View>

      <View style={styles.textContainer}>
        {loading ? (
          <ShimmerPlaceHolder
            style={[commonStyles.cardTitle, { width: "80%" }]}
            {...shimmerProps}
          />
        ) : (
          <Text style={commonStyles.cardTitle}>{name}</Text>
        )}
        {loading ? (
          <ShimmerPlaceHolder
            style={[commonStyles.cardSubtitle, { width: "60%", marginTop: 8, marginBottom: 16 }]}
            {...shimmerProps}
          />
        ) : (
          <Text style={[commonStyles.cardSubtitle,{marginBottom: 4}]}>
            Expertise: {expertise?.join(", ")}
          </Text>
        )}
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={() => Linking.openURL(`mailto:${email}`)}>
            <MaterialIcons name="email" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(`${linkedIn}`)}>
            <FontAwesome5 name="linkedin" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0", // Light gray border
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16, // Increased gap for better spacing
  },
});

export default FacultyCard;
