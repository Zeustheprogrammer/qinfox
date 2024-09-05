import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Alert,
  StyleSheet,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import Colors from "@/constants/Colors";
import DropdownComponent from "@/components/DropDownField";
import {
  scale,
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";
import CustomInputField from "@/components/CustomInputField";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { getColleges } from "@/lib/firebaseService";
import useFetch from "@/lib/fetch";
import Loader from "@/components/Loader";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  collegeId: Yup.string().required("College is required"),
  rollNumber: Yup.string().required("Roll Number is required"),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .length(10, "Phone Number must be 10 digits"),
});

const initialValues = {
  name: "",
  email: "",
  password: "",
  collegeId: "",
  rollNumber: "",
  phoneNumber: "",
};

export default function Register() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { data, loading } = useFetch(getColleges);
  const [modalVisible, setModalVisible] = useState(false);

  const onSignUpPress = async (
    values: typeof initialValues,
    { resetForm }: FormikHelpers<typeof initialValues>
  ) => {
    try {
      setSubmitting(true);
      const selectedCollege = data?.find(
        (college) => college.id === values.collegeId
      );

      if (selectedCollege) {
        console.log(selectedCollege);
        // Validate email with the selected college's regex
        const emailRegex = selectedCollege.regex;
        if (!values.email.toLowerCase().endsWith(emailRegex)) {
          throw new Error(
            "Email does not match the required format for the selected college."
          );
        }
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: values.name,
        email: values.email,
        collegeId: values.collegeId,
        rollNumber: values.rollNumber,
        role: "student",
        phoneNumber: values.phoneNumber,
      });
      setModalVisible(true);
      resetForm();
    } catch (error: Error | any) {
      Alert.alert("Registration Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Create Account</Text>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => onSignUpPress(values, actions)}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <CustomInputField
                label="Name"
                placeholder="John Snow"
                onChangeText={handleChange("name")}
                value={values.name}
                error={touched.name && errors.name}
              />
              {errors.name && touched.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
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
                secureTextEntry={true}
                onChangeText={handleChange("password")}
                value={values.password}
                error={touched.password && errors.password}
              />
              {errors.password && touched.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
              <DropdownComponent
                label="College"
                placeholder="Select College"
                data={data || []}
                setSelected={handleChange("collegeId")}
                value={values.collegeId}
                error={touched.collegeId && errors.collegeId}
              />
              {errors.collegeId && touched.collegeId && (
                <Text style={styles.errorText}>{errors.collegeId}</Text>
              )}
              <CustomInputField
                label="Roll Number"
                placeholder="22075A0523"
                onChangeText={handleChange("rollNumber")}
                value={values.rollNumber}
                error={touched.rollNumber && errors.rollNumber}
              />
              {errors.rollNumber && touched.rollNumber && (
                <Text style={styles.errorText}>{errors.rollNumber}</Text>
              )}
              <CustomInputField
                label="Phone Number"
                placeholder="9876543210"
                onChangeText={handleChange("phoneNumber")}
                value={values.phoneNumber}
                error={touched.phoneNumber && errors.phoneNumber}
              />
              {errors.phoneNumber && touched.phoneNumber && (
                <Text style={styles.errorText}>{errors.phoneNumber}</Text>
              )}
              <CustomButton title="Sign Up" handlePress={handleSubmit} />
            </View>
          )}
        </Formik>

        <CustomButton
          title="Login"
          containerColor={Colors.secondary}
          textColor={Colors.primary}
          containerStyles={{ borderWidth: 1 }}
          handlePress={() => router.back()}
        />
      </ScrollView>
      <Loader visible={submitting || loading} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              A verification email has been sent to your email address. Please
              verify your email to complete registration.
            </Text>
            <CustomButton
              title="OK"
              handlePress={() => {
                setModalVisible(false);
                router.back();
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.secondary,
    paddingBottom: moderateVerticalScale(20),
  },
  logo: {
    width: scale(60),
    height: scale(60),
    alignSelf: "center",
    marginTop: moderateVerticalScale(40),
  },
  form: {
    width: "100%",
  },
  title: {
    fontSize: moderateScale(20),
    alignSelf: "center",
    fontWeight: "600",
    marginTop: moderateVerticalScale(50),
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
  errorText: {
    color: "red",
    fontSize: moderateScale(12),
    marginLeft: moderateScale(25),
    marginTop: moderateVerticalScale(4),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent black background
  },
  modalView: {
    width: "80%", // Adjust the width as needed
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
