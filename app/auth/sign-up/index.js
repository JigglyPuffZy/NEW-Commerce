import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Animated } from "react-native";
// const sendSmsRoute = require('../sendSMS/index');
// import { getPhpFilePath } from '../utils/pathHelper';

export default function SignUp() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [resendModalVisible, setResendModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState(
    new Array(6).fill("")
  );
  const [loading, setLoading] = useState(false);
  const [lastname, setLastName] = useState("");
  const [firstname, setFirstName] = useState("");
  const [midname, setMidName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState("buyer");
  const inputRefs = useRef([]);

  const handleCreateAccount = async () => {
    if (
      !lastname ||
      !firstname ||
      !email ||
      !password ||
      !confirmPassword ||
      !userPhone
    ) {
      setErrorMessage("Please fill in all fields.");
      setErrorModalVisible(true);
      return;
    }

    // Generate 6-digit code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    try {
      // Step 1: Save user data with verification code
      const registerResponse = await fetch(
        "http://localhost/pottery/register.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            lastname,
            firstname,
            midname,
            email,
            contact: userPhone,
            password: password,
            role: selectedRole,
            isVerified: 0,
            verificationCode,
          }),
        }
      );

      const result = await registerResponse.json();

      if (result.success) {
        // if (smsResponse.ok) {
        setModalVisible(true); // Show verification modal
        // }
      }
    } catch (error) {
      setErrorMessage("Registration failed. Please try again.");
      setErrorModalVisible(true);
    }
  };

  const handleChange = (text, index) => {
    const newCode = [...verificationCode];
    if (text) {
      newCode[index] = text;
      setVerificationCode(newCode);
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    } else {
      newCode[index] = "";
      setVerificationCode(newCode);
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    const enteredCode = verificationCode.join("");

    try {
      const response = await fetch("https://rancho-agripino.com/database/potteryFiles/pottery/verify.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: enteredCode,
          contact: userPhone,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setModalVisible(false);
        router.push("auth/sign-in");
      } else {
        setErrorMessage("Invalid verification code");
        setErrorModalVisible(true);
      }
    } catch (error) {
      setErrorMessage("Verification failed");
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    // Generate 6-digit code
    const newverificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    try {
      // Step 1: Save user data with verification code
      const registerResponse = await fetch(
        "https://rancho-agripino.com/database/potteryFiles/pottery/resend.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            contact: userPhone,
            newverificationCode: newverificationCode,
          }),
        }
      );

      const result = await registerResponse.json();

      if (result.success) {
        // if (smsResponse.ok) {
          setResendModalVisible(false);
        setModalVisible(true); // Show verification modal
        // }
      }
    } catch (error) {
      setErrorMessage("Registration failed. Please try again.");
      setErrorModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Last Name"
        style={styles.input}
        placeholderTextColor="#888"
        value={lastname}
        onChangeText={setLastName}
      />
      <TextInput
        placeholder="First Name"
        style={styles.input}
        placeholderTextColor="#888"
        value={firstname}
        onChangeText={setFirstName}
      />
      <TextInput
        placeholder="Middle Name"
        style={styles.input}
        placeholderTextColor="#888"
        value={midname}
        onChangeText={setMidName}
      />
      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        keyboardType="phone-pad"
        placeholderTextColor="#888"
        value={userPhone}
        onChangeText={setUserPhone}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Confirm Password"
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#888"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <View style={styles.roleContainer}>
        <Text style={styles.label}>Select your role:</Text>
        <View style={styles.roleSelectionRow}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              selectedRole === "buyer" && styles.selectedRole,
            ]}
            onPress={() => setSelectedRole("buyer")}
          >
            <Text style={styles.radioLabel}>Buyer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              selectedRole === "seller" && styles.selectedRole,
            ]}
            onPress={() => setSelectedRole("seller")}
          >
            <Text style={styles.radioLabel}>Seller</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleCreateAccount}
        style={styles.signUpButton}
      >
        <Text style={styles.signUpButtonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("auth/sign-in")}
        style={styles.signInLink}
      >
        <Text style={styles.signInLinkText}>
          Already have an account? Sign In
        </Text>
      </TouchableOpacity>

      {/* Modal for verification code */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✖</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Enter Verification Code</Text>
            <ScrollView
              contentContainerStyle={styles.verificationCodeContainer}
            >
              {verificationCode.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={styles.codeInput}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  placeholder="-"
                  placeholderTextColor="#888"
                />
              ))}
            </ScrollView>
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#069906"
                style={styles.loadingIndicator}
              />
            ) : (
              <TouchableOpacity
                onPress={handleVerify}
                style={styles.verifyButton}
              >
                <Text style={styles.verifyButtonText}>Verify</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => setResendModalVisible(true)}
              style={styles.resendButton}
            >
              <Text style={styles.resendButtonText}>Resend Code</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* Error Modal for incorrect verification code */}
      <Modal
        visible={errorModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.errorModalContent}>
            <Text style={styles.modalTitle}>Invalid </Text>
            <Text style={styles.modalMessage}>{errorMessage}</Text>
            <TouchableOpacity
              onPress={() => setErrorModalVisible(false)}
              style={styles.verifyButton}
            >
              <Text style={styles.verifyButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Resend Code Modal */}
      <Modal
        visible={resendModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setResendModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Resend Verification Code</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to resend the verification code?
            </Text>
            <TouchableOpacity
              onPress={handleResendCode}
              style={styles.verifyButton}
            >
              <Text style={styles.verifyButtonText}>Yes, Resend</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setResendModalVisible(false)}
              style={styles.verifyButton}
            >
              <Text style={styles.verifyButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#069906",
    textAlign: "center",
  },
  input: {
    height: 55,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  signUpButton: {
    backgroundColor: "#069906",
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: "#069906",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  signInLink: {
    marginTop: 20,
    alignItems: "center",
  },
  signInLinkText: {
    color: "#069906",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "80%", // Limit the height to avoid overflow
    justifyContent: "center",
    alignItems: "center",
  },
  verificationCodeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
  },
  codeInput: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 24,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  roleContainer: {
    width: "100%",
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    top: 10,
  },
  roleSelectionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  roleButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: "center",
  },
  selectedRole: {
    backgroundColor: "#BBF7D0",
    borderColor: "#069906",
    borderWidth: 2,
  },
  label: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
  },
  radioLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#1F2937",
  },
  verifyButton: {
    backgroundColor: "#069906",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    shadowColor: "#069906",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  verifyButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  resendButton: {
    marginTop: 15,
    alignItems: "center",
  },
  resendButtonText: {
    color: "#069906",
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#069906",
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  errorModalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "80%", // Limit the height to avoid overflow
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#069906",
    textAlign: "center",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
});
