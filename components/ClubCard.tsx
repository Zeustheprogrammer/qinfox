import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import { commonStyles } from "@/styles/commonStyles";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

interface Club {
  id: string;
  name: string;
  tag_line: string;
  logo_url: string;
  description: string;
  moto: string;
}

interface ClubCardProps {
  item: Club;
  loading: boolean;
}

const ClubCard: React.FC<ClubCardProps> = ({ item, loading }) => {
  const { id, name, tag_line, logo_url } = item;

  const handlePress = () => {
    router.push({
      pathname: `/student/club/`,
      params: {
        id,
        name,
        tag_line,
        logo_url,
        description: item.description,
        moto: item.moto,
      },
    });
    // Uncomment the following line when ready to implement navigation
    // router.push(`../club/${id}`);
  };

  const shimmerProps = useMemo(
    () => ({
      shimmerColors: ["#ebebeb", "#c5c5c5", "#ebebeb"],
      shimmerStyle: { borderRadius: 4 },
    }),
    []
  );

  const renderContent = () => (
    <>
      <View>
        {loading ? (
          <ShimmerPlaceHolder style={styles.image} {...shimmerProps} />
        ) : (
          <Image source={{ uri: logo_url }} style={styles.image} />
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
            style={[commonStyles.cardSubtitle, { width: "60%", marginTop: 8 }]}
            {...shimmerProps}
          />
        ) : (
          <Text style={commonStyles.cardSubtitle}>{tag_line}</Text>
        )}
      </View>
    </>
  );

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[commonStyles.cardContainer, styles.container]}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
});

export default React.memo(ClubCard);
