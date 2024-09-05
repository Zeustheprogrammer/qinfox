import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from "react-native-size-matters";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import * as Yup from "yup";
import { Formik } from "formik";
import CustomInputField from "@/components/CustomInputField";
import CustomButton from "@/components/CustomButton";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import CustomDateTimePicker from "@/components/CustomDateTimePicker";
import CustomSwitch from "@/components/CustomSwitch";
import CustomImagePicker from "@/components/CustomImagePicker";
import { auth, db } from "@/lib/firebaseConfig";
import Loader from "@/components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  bannerUrl: Yup.string()
    .url("Enter a valid URL")
    .required("Banner URL is required"),
  isPublic: Yup.boolean().required("Public status is required"),
  startDate: Yup.date()
    .required("Start Date is required")
    .test("startDate", "Start Date must be before End Date", function (value) {
      const { endDate } = this.parent;
      return !endDate || value <= endDate;
    }),
  endDate: Yup.date().required("End Date is required"),
  registrationEndDate: Yup.date()
    .required("End Date is required")
    .test(
      "registrationEndDate",
      "Registration End Date must be before or equal to Start Date",
      function (value) {
        const { startDate } = this.parent;
        return !startDate || value <= startDate;
      }
    ),
  location: Yup.string().required("Location is required"),
  maxSize: Yup.number()
    .min(1, "Max Size must be at least 1")
    .required("Max Size is required")
    .test(
      "maxSize",
      "Max Size must be greater than or equal to Min Size",
      function (value) {
        const { minSize } = this.parent;
        return !minSize || value >= minSize;
      }
    ),
  minSize: Yup.number()
    .min(1, "Min Size must be at least 1")
    .required("Min Size is required")
    .test(
      "minSize",
      "Min Size must be less than or equal to Max Size",
      function (value) {
        const { maxSize } = this.parent;
        return !maxSize || value <= maxSize;
      }
    ),
  price: Yup.number()
    .min(0, "Price cannot be negative")
    .required("Price is required"),
});

const initialValues = {
  name: "",
  description: "",
  bannerUrl: "",
  isPublic: false,
  startDate: null,
  endDate: null,
  registrationEndDate: null,
  location: "",
  maxSize: 1,
  minSize: 1,
  price: 0,
};

const Add = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const addEvent = async (values) => {
    setLoading(true);
    const clubName = await AsyncStorage.getItem("name");
    const clubId = auth.currentUser?.uid;
    values.clubId = clubId;
    values.clubName = clubName;
    values.createdAt = Timestamp.now();
    values.updatedAt = Timestamp.now();
    await addDoc(collection(db, "events"), values)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        router.back();
      })
      .catch((e) => console.error("Error adding document: ", e))
      .finally(() => setLoading(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <Image
              source={require("@/assets/images/close.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Post Event</Text>
        </View>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema} // Ensure this covers all fields
          onSubmit={(values) => {
            console.log("Form Values: ", values);
            addEvent(values);
          }}
        >
          {({
            handleChange,
            handleSubmit,
            values,
            errors,
            setFieldValue,
            touched,
            resetForm,
          }) => (
            <>
              <CustomInputField
                label="Name"
                placeholder="Event Name"
                onChangeText={handleChange("name")}
                value={values.name}
                error={touched.name && errors.name}
              />
              {errors.name && touched.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}

              <CustomInputField
                label="Description"
                placeholder="Description"
                onChangeText={handleChange("description")}
                value={values.description}
                error={touched.description && errors.description}
                isLarge={true}
              />
              {errors.description && touched.description && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}

              <CustomImagePicker
                label="Banner Image"
                placeholder="Banner Image"
                onChange={handleChange("bannerUrl")}
                value={values.bannerUrl}
                error={touched.bannerUrl && errors.bannerUrl}
              />
              {errors.bannerUrl && touched.bannerUrl && (
                <Text style={styles.errorText}>{errors.bannerUrl}</Text>
              )}

              <CustomDateTimePicker
                label="Start Date & Time"
                placeholder="Start Date & Time"
                value={values.startDate}
                onChange={(date) => setFieldValue("startDate", date)}
                error={touched.startDate && errors.startDate}
              />
              {errors.startDate && touched.startDate && (
                <Text style={styles.errorText}>{String(errors.startDate)}</Text>
              )}

              <CustomDateTimePicker
                label="End Date & Time"
                placeholder="End Date & Time"
                value={values.endDate}
                onChange={(date) => setFieldValue("endDate", date)}
                error={touched.endDate && errors.endDate}
              />
              {errors.endDate && touched.endDate && (
                <Text style={styles.errorText}>{String(errors.endDate)}</Text>
              )}
              <CustomDateTimePicker
                label="Registraion End Date & Time"
                placeholder="Registation End Date & Time"
                value={values.registrationEndDate}
                onChange={(date) => setFieldValue("registrationEndDate", date)}
                error={
                  touched.registrationEndDate && errors.registrationEndDate
                }
              />
              {errors.registrationEndDate && touched.registrationEndDate && (
                <Text style={styles.errorText}>
                  {String(errors.registrationEndDate)}
                </Text>
              )}
              <CustomInputField
                label="Location"
                placeholder="Location"
                onChangeText={handleChange("location")}
                value={values.location}
                error={touched.location && errors.location}
              />
              {errors.location && touched.location && (
                <Text style={styles.errorText}>{errors.location}</Text>
              )}

              <CustomInputField
                label="Max Size"
                placeholder="Max Size"
                keyboardType="numeric"
                onChangeText={handleChange("maxSize")}
                value={values.maxSize.toString()}
                error={touched.maxSize && errors.maxSize}
              />
              {errors.maxSize && touched.maxSize && (
                <Text style={styles.errorText}>{errors.maxSize}</Text>
              )}

              <CustomInputField
                label="Min Size"
                placeholder="Min Size"
                keyboardType="numeric"
                onChangeText={handleChange("minSize")}
                value={values.minSize.toString()}
                error={touched.minSize && errors.minSize}
              />
              {errors.minSize && touched.minSize && (
                <Text style={styles.errorText}>{errors.minSize}</Text>
              )}

              <CustomInputField
                label="Price"
                placeholder="Price"
                keyboardType="numeric"
                onChangeText={handleChange("price")}
                value={values.price.toString()}
                error={touched.price && errors.price}
              />
              {errors.price && touched.price && (
                <Text style={styles.errorText}>{errors.price}</Text>
              )}
              <CustomSwitch
                label="Open For Everyone?"
                value={values.isPublic}
                onValueChange={(value) => setFieldValue("isPublic", value)}
                thumbColorOn="#000000" // Updated to blend with EF4444
                thumbColorOff="#A9A9A9" // A lighter shade of EF4444
                trackColorOn="#D3D3D3" // A lighter shade for the track when on
                trackColorOff="#808080" // A lighter shade for the track when off
                error={undefined} labelStyle={undefined} containerStyle={undefined} switchStyle={undefined}              />
              <CustomButton title="Post Event" handlePress={handleSubmit} />
            </>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    marginBottom: moderateVerticalScale(20),
  },
  icon: {
    width: moderateScale(16),
    height: moderateVerticalScale(16),
  },
  header: {
    width: "100%",
    height: moderateVerticalScale(50),
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: moderateScale(20),
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: "600",
    marginLeft: moderateScale(20),
  },
  errorText: {
    color: "red",
    fontSize: moderateScale(14),
    marginLeft: moderateScale(25),
    marginTop: moderateVerticalScale(4),
  },
});
