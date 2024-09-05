import { Href, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Alert,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { Formik } from "formik";
import * as Yup from "yup";
import Colors from "@/constants/Colors";
import {
  scale,
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";
import CustomInputField from "@/components/CustomInputField";
import { auth, db } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "@/components/Loader";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const initialValues = {
  email: "",
  password: "",
};

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const fetchUser = async (uid: string): Promise<{ id: string } & any> => {
    const userDoc = await getDoc(doc(db, "users", uid));
    const userData = userDoc.data();

    return { id: userDoc.id, ...userData };
  };
  const goToHome = async (userData: any) => {
    await AsyncStorage.setItem("name", userData.name);
    await AsyncStorage.setItem("email", userData.email);
    await AsyncStorage.setItem("role", userData.role);
    if (userData.role == "student") {
      router.replace("/student");
    } else {
      router.replace("/club");
    }
  };

  const onSignInPress = async (form: { email: string; password: string }) => {
    try {
      setLoading(true);
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = userCredential.user;

      // Check if the user's email is verified
      if (user.emailVerified) {
        // Fetch user role from Firestore or your backend service
        const userData = await fetchUser(user.uid); // Assume this is a function that gets the role
        goToHome(userData);
      } else {
        Alert.alert(
          "Email not verified",
          "Please verify your email before logging in."
        );
        signOut(auth);
      }
    } catch (error: Error | any) {
      Alert.alert("Login Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Login</Text>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => onSignInPress(values)}
          >
            {({ handleChange, handleSubmit, values, errors, touched }) => (
              <>
                <CustomInputField
                  label="Email"
                  placeholder="email@placeholder.com"
                  onChangeText={handleChange("email")}
                  value={values.email}
                  error={touched.email && errors.email}
                />
                {errors.email && touched.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
                <CustomInputField
                  label="Password"
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={handleChange("password")}
                  value={values.password}
                  error={touched.password && errors.password}
                />
                {errors.password && touched.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
                <Text style={styles.forgetPassword}>Forget Password</Text>
                <CustomButton title="Login" handlePress={handleSubmit} />
                <CustomButton
                  title="Create Account"
                  containerColor={Colors.secondary}
                  textColor={Colors.primary}
                  containerStyles={{ borderWidth: 1 }}
                  handlePress={() => router.push("./auth/register")}
                />
              </>
            )}
          </Formik>
          <Loader visible={loading} />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  logo: {
    width: scale(60),
    height: scale(60),
    alignSelf: "center",
    marginTop: moderateVerticalScale(40),
  },
  errorText: {
    color: "red",
    fontSize: moderateScale(14),
    marginLeft: moderateScale(25),
    marginTop: moderateVerticalScale(4),
  },
  title: {
    fontSize: moderateScale(20),
    alignSelf: "center",
    fontWeight: "600",
    marginTop: moderateVerticalScale(70),
  },

  formContainer: {
    width: "100%",
  },

  forgetPassword: {
    alignSelf: "flex-end",
    marginRight: moderateScale(20),
    marginTop: moderateVerticalScale(10),
    fontWeight: "500",
    fontSize: moderateScale(16),
  },
});
