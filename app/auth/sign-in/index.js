import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, SafeAreaView, ScrollView, Animated } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { Colors } from './../../../constants/Colors';
import { Feather } from '@expo/vector-icons';

export default function Index() {
  const navigation = useNavigation();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1)); // Initial opacity is 1 (fully visible)
  const [scaleAnim] = useState(new Animated.Value(1)); // Initial scale is 1 (normal size)

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleSignIn = () => {
    setModalVisible(true);
  };

  const selectRole = (role) => {
    // Combine fade and scale animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0, // Fade out to opacity 0
        duration: 500, // Animation duration (in milliseconds)
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.2, // Slightly increase size
        friction: 3, // Control the bounce effect
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      if (role === 'buyer') {
        router.push('auth/home');
      } else {
        router.push('auth/seller');
      }
      fadeAnim.setValue(1); // Reset the opacity for the next time the modal is shown
      scaleAnim.setValue(1); // Reset the scale for the next time the modal is shown
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {/* Header */}
        <Text style={styles.title}>Let's Sign You In</Text>
        <Text style={styles.subtitle}>Welcome Back, we've missed you!</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter Password"
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Feather
                name={passwordVisible ? 'eye-off' : 'eye'}
                size={20}
                color={Colors.DARK_GRAY}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity 
          onPress={handleSignIn}
          style={styles.signInButton}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
          
        {/* Create Account Button */}
        <TouchableOpacity
          onPress={() => router.push('auth/sign-up')}
          style={styles.createAccountButton}
        >
          <Text style={styles.createAccountButtonText}>Create Account</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for selecting role */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
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
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  scrollViewContainer: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Poppins-bold',
    fontSize: 28,
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Poppins-medium',
    fontSize: 18,
    color: Colors.GRAY,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Poppins-medium',
    fontSize: 14,
    color: Colors.DARK_GRAY,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    padding: 12,
    borderRadius: 8,
    fontFamily: 'Poppins-regular',
    fontSize: 14,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 8,
    backgroundColor: Colors.WHITE,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontFamily: 'Poppins-regular',
    fontSize: 14,
  },
  eyeIcon: {
    padding: 10,
  },
  signInButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
    elevation: 2,
  },
  signInButtonText: {
    color: Colors.WHITE,
    fontFamily: 'Poppins-medium',
    fontSize: 16,
  },
  createAccountButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
    elevation: 2,
  },
  createAccountButtonText: {
    color: Colors.DARK_GRAY,
    fontFamily: 'Poppins-medium',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 350,
    backgroundColor: Colors.WHITE,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  modalTitle: {
    fontFamily: 'Poppins-bold',
    fontSize: 20,
    color: Colors.PRIMARY,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    marginTop: 8,
    alignItems: 'center',
    elevation: 2,
  },
  modalButtonText: {
    color: Colors.WHITE,
    fontFamily: 'Poppins-medium',
    fontSize: 16,
  },
  modalCloseButton: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: Colors.GRAY,
    borderRadius: 10,
    marginTop: 8,
    alignItems: 'center',
    elevation: 2,
  },
  modalCloseButtonText: {
    color: Colors.WHITE,
    fontFamily: 'Poppins-medium',
    fontSize: 16,
  },
});
