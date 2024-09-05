import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import Colors from "@/constants/Colors";
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from "react-native-size-matters";

const SearchInput = ({
  query,
  setQuery,
  placeholder,
}: {
  query?: string;
  setQuery: (query: string) => void;
  placeholder?: string;
}) => {
  const [text, setText] = useState(query || "");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableOpacity onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.searchBox}>
            <Image
              style={styles.icon}
              source={require("@/assets/images/search.png")}
            />
            <TextInput
              style={styles.input}
              placeholderTextColor={Colors.lightGray}
              value={text}
              placeholder={placeholder}
              onChangeText={(text) => {
                setText(text);
                setQuery(text);
              }}
            />
            {text !== "" && (
              <TouchableOpacity
                onPress={() => {
                  setText("");
                  setQuery("");
                }}
                style={styles.closeButton}
              >
                <Image
                  source={require("@/assets/images/close.png")}
                  style={styles.close}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginBottom: moderateVerticalScale(10),
  },
  searchBox: {
    width: "100%",
    height: verticalScale(40),
    borderWidth: 0.4,
    marginTop: moderateVerticalScale(10),
    borderRadius: moderateScale(30),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    paddingHorizontal: moderateScale(12), // Add padding to avoid text overlapping with the edges
    justifyContent: "space-between", // Ensure space between search icon and close icon
  },
  icon: {
    width: scale(16),
    height: scale(16),
  },
  closeButton: {
    padding: moderateScale(5), // Add padding to make the touchable area larger
  },
  close: {
    width: scale(16),
    height: scale(16),
  },
  input: {
    flex: 1,
    color: Colors.primary,
    fontSize: moderateScale(14),
    marginHorizontal: moderateScale(10), // Add margin horizontally for spacing
  },
});
