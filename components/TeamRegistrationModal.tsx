import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import Modal from "react-native-modal";
import Colors from "@/constants/Colors";

const TeamRegistrationModal = ({
  isVisible,
  onClose,
  minSize,
  maxSize,
  price,
  onRegister,
}) => {
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState(() => Array(minSize).fill(""));
  const [referenceId, setReferenceId] = useState("");

  const handleInputChange = useCallback((text, index) => {
    setTeamMembers((prevMembers) => {
      const newMembers = [...prevMembers];
      newMembers[index] = text;
      return newMembers;
    });
  }, []);

  const handleAddMember = useCallback(() => {
    setTeamMembers((prevMembers) =>
      prevMembers.length < maxSize ? [...prevMembers, ""] : prevMembers
    );
  }, [maxSize]);

  const handleRemoveMember = useCallback((index) => {
    setTeamMembers((prevMembers) => prevMembers.filter((_, i) => i !== index));
  }, []);

  const handleRegister = useCallback(() => {
    if (!teamName) {
      Alert.alert("Error", "Please enter the team name");
      return;
    }
    if (Number(price) > 0 && !referenceId) {
      Alert.alert("Error", "Please enter the payment reference ID");
      return;
    }
    onRegister(teamName, teamMembers, referenceId);
  }, [teamName, teamMembers, referenceId, price, onRegister]);

  const renderMemberInput = useCallback(
    (member, index) => (
      <View key={index} style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={`Member ${index + 1}`}
          value={member}
          onChangeText={(text) => handleInputChange(text, index)}
        />
        {teamMembers.length > minSize && (
          <TouchableOpacity onPress={() => handleRemoveMember(index)}>
            <Text style={styles.removeButton}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    ),
    [handleInputChange, handleRemoveMember, minSize, teamMembers.length]
  );

  const renderPaymentSection = useCallback(
    () =>
      Number(price) > 0 && (
        <View style={styles.qrContainer}>
          <Text style={styles.qrTitle}>Scan to Pay</Text>
          <Image
            source={{
              uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                `https://your-payment-link.com?amount=${Number(price)}`
              )}`,
            }}
            style={styles.qrImage}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Payment Reference ID"
            value={referenceId}
            onChangeText={setReferenceId}
          />
        </View>
      ),
    [price, referenceId]
  );

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Enter Team Details</Text>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <TextInput
            style={styles.input}
            placeholder="Team Name"
            value={teamName}
            onChangeText={setTeamName}
          />
          {teamMembers.map(renderMemberInput)}
          {teamMembers.length < maxSize && (
            <TouchableOpacity
              onPress={handleAddMember}
              style={styles.addButtonContainer}
            >
              <Text style={styles.addButton}>Add Member</Text>
            </TouchableOpacity>
          )}
          {Number(price) > 0 && (
            <Text style={styles.priceText}>Price: ₹{price}</Text>
          )}
          {renderPaymentSection()}
          <TouchableOpacity
            onPress={handleRegister}
            style={styles.registerButtonContainer}
          >
            <Text style={styles.registerButton}>Register</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  removeButton: {
    color: "red",
    marginLeft: 10,
  },
  addButtonContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  addButton: {
    color: Colors.primary,
    fontSize: 16,
  },
  qrContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  qrTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  qrImage: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  registerButtonContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 15,
  },
  registerButton: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
});

export default TeamRegistrationModal;
