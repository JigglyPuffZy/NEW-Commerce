import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { Colors } from './../../../constants/Colors';

export default function Index() {
  const navigation = useNavigation();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleSignIn = () => {
    setModalVisible(true);
  };

  const selectRole = (role) => {
    setModalVisible(false);
    if (role === 'buyer') {
      router.push('auth/home'); // Navigate to the buyer's home screen
    } else {
      router.push('auth/seller'); // Navigate to the seller's home screen
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let's Sign You In</Text>
      <Text style={styles.subtitle}>Welcome Back, we've missed you!</Text>

      <View style={styles.inputContainer}>
        <Text>Email</Text>
        <TextInput style={styles.input} placeholder="Enter Email" />
      </View>

      <View style={styles.inputContainer}>
        <Text>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          secureTextEntry={true}
        />
        
        {/* Sign In Button */}
        <TouchableOpacity 
        onPress={handleSignIn}
        style={styles.signInButton}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity >
        
        {/* Create Account Button */}
        <TouchableOpacity
          onPress={() => router.push('auth/sign-up')}
          style={styles.createAccountButton}
        >
          <Text style={styles.createAccountButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for selecting role */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Your Role</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => selectRole('buyer')}
            >
              <Text style={styles.modalButtonText}>Buyer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => selectRole('seller')}
            >
              <Text style={styles.modalButtonText}>Seller</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)} // Close the modal on cancel
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: Colors.WHITE,
    marginTop: 60,
    height: '100%',
  },
  title: {
    fontFamily: 'Poppins-bold',
    fontSize: 32,
    color: Colors.PRIMARY,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins-medium',
    fontSize: 20,
    color: Colors.GRAY,
    textAlign: 'center',
    marginTop: 10,
  },
  inputContainer: {
    marginTop: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.GRAY,
    padding: 15,
    marginTop: 10,
    borderRadius: 15,
  },
  signInButton: {
    padding: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    marginTop: 50,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  signInButtonText: {
    color: Colors.PRIMARY,
    textAlign: 'center',
  },
  createAccountButton: {
    padding: 20,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 15,
    marginTop: 10,
  },
  createAccountButtonText: {
    color: Colors.WHITE,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: Colors.WHITE,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Poppins-bold',
    fontSize: 20,
    color: Colors.PRIMARY,
    marginBottom: 20,
  },
  modalButton: {
    width: '100%',
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: Colors.WHITE,
    fontFamily: 'Poppins-medium',
  },
  modalCloseButton: {
    width: '100%',
    padding: 15,
    backgroundColor: Colors.GRAY,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: Colors.WHITE,
    fontFamily: 'Poppins-medium',
  },
});
