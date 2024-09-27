import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Animated } from 'react-native';

export default function SignUp() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [resendModalVisible, setResendModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState(new Array(6).fill(''));
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);

  // States for form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateAccount = () => {
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      setErrorModalVisible(true);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setErrorModalVisible(true);
      return;
    }
    setModalVisible(true);
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
      newCode[index] = '';
      setVerificationCode(newCode);
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleVerify = () => {
    setLoading(true);
    const enteredCode = verificationCode.join('');
    setTimeout(() => {
      if (enteredCode === '123456') {
        setModalVisible(false);
        router.push('auth/sign-in');
      } else {
        setErrorMessage('Invalid code. Please try again.');
        setErrorModalVisible(true);
      }
      setLoading(false);
    }, 1500);
  };

  const handleResendCode = () => {
    setResendModalVisible(false);
    Alert.alert('Verification Code', 'A new verification code has been sent to your email.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Name"
        style={styles.input}
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
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

      <TouchableOpacity onPress={handleCreateAccount} style={styles.signUpButton}>
        <Text style={styles.signUpButtonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('auth/sign-in')} style={styles.signInLink}>
        <Text style={styles.signInLinkText}>Already have an account? Sign In</Text>
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
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✖</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Enter Verification Code</Text>
            <ScrollView contentContainerStyle={styles.verificationCodeContainer}>
              {verificationCode.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => inputRefs.current[index] = ref}
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
              <ActivityIndicator size="large" color="#069906" style={styles.loadingIndicator} />
            ) : (
              <TouchableOpacity onPress={handleVerify} style={styles.verifyButton}>
                <Text style={styles.verifyButtonText}>Verify</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setResendModalVisible(true)} style={styles.resendButton}>
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
            <TouchableOpacity onPress={() => setErrorModalVisible(false)} style={styles.verifyButton}>
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
            <Text style={styles.modalMessage}>Are you sure you want to resend the verification code?</Text>
            <TouchableOpacity onPress={handleResendCode} style={styles.verifyButton}>
              <Text style={styles.verifyButtonText}>Yes, Resend</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setResendModalVisible(false)} style={styles.verifyButton}>
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
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#069906',
    textAlign: 'center',
  },
  input: {
    height: 55,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  signUpButton: {
    backgroundColor: '#069906',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#069906',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  signInLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  signInLinkText: {
    color: '#069906',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%', // Limit the height to avoid overflow
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationCodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
  codeInput: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  verifyButton: {
    backgroundColor: '#069906',
    paddingVertical: 10,
    paddingHorizontal:20,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#069906',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  verifyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  resendButtonText: {
    color: '#069906',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#069906',
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  errorModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%', // Limit the height to avoid overflow
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#069906',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
});
